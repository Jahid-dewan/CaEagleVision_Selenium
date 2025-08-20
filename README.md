// @ts-nocheck
const { Builder, By, Browser, until, Key } = require("selenium-webdriver");
const { faker } = require("@faker-js/faker");
const assert = require("assert");
const fs = require("fs");

const email = "root@ca.com";
const pass = "qweqwe";

const setAngularInput = `
  const input = arguments[0];
  const value = arguments[1];
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
`;

async function waitAndFill(driver, xpath, value, isInput = true, waitTimeout = 15000) {
  const element = await driver.wait(until.elementLocated(By.xpath(xpath)), waitTimeout);
  await driver.wait(until.elementIsVisible(element), waitTimeout);
  if (isInput && value !== null) {
    await driver.executeScript(setAngularInput, element, value);
  } else if (!isInput) {
    await element.click();
  }
  await driver.sleep(700);
  return element;
}

describe("CA EagleVision Client & Property Test", function() {
  this.timeout(180000); // 3 minutes

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should fill client info, property info, and click Update", async () => {
    try {
      // Login
      await driver.get("https://caeaglevision-uat.connectauz.com.au/");
      await driver.manage().window().maximize();
      await waitAndFill(driver, "//input[@formcontrolname='username']", email);
      await waitAndFill(driver, "//input[@formcontrolname='password']", pass);
      await waitAndFill(driver, "//input[@value='Login']", null, false);

      // Navigate to Clients
      await waitAndFill(driver, "//a[@href='/client' and .//span[text()='Clients']]", null, false);
      await waitAndFill(driver, "//a[@href='/client/add' and contains(., 'Add Clients')]", null, false);

      // Fill Client Info
      await waitAndFill(driver, "(//input[@formcontrolname='name'])[1]", faker.name.fullName());

      const isSingleValue = faker.datatype.boolean() ? "0: true" : "1: false";
      await waitAndFill(driver, `//select[@formcontrolname='isSingle']/option[@value='${isSingleValue}']`, null, false);

      await waitAndFill(driver, "//input[@formcontrolname='noOfDependent']", faker.datatype.number({ min: 0, max: 5 }).toString());
      await waitAndFill(driver, "//input[@formcontrolname='address']", faker.address.streetAddress());

      const states = [
        'f6714ee6-ad71-446a-aadb-987b6b784b56','e7b7bf86-c777-41d1-a54f-d00f1edc85e1',
        'cf2d3a5d-03fd-45f6-8625-ca0fc1446820','5953f7b5-bb6f-489a-8391-1dc45a143c2a',
        'e8707367-78e6-4d0e-ad1f-9805fcdc39d0','6a4c0246-eeb2-4131-bab5-d8435dc39230',
        'e7dbaef4-7fb6-4656-9752-6d577761ba42','510111a7-1350-466c-b372-f4238c0da668'
      ];
      const randomState = states[Math.floor(Math.random() * states.length)];
      await waitAndFill(driver, `//select[@formcontrolname='stateId']/option[@value='${randomState}']`, null, false);

      // First Applicant
      await waitAndFill(driver, "(//input[@formcontrolname='name'])[2]", faker.name.fullName());

      const genderOptions = ["Male", "Female", "Other"];
      const gender = genderOptions[Math.floor(Math.random() * genderOptions.length)];
      await waitAndFill(driver, `(//select[@formcontrolname='gender'])[1]/option[@value='${gender}']`, null, false);

      // DOB picker
      await waitAndFill(driver, "(//input[@formcontrolname='dob'])[1]", null, false);
      await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'btn-light') and text()='1']")), 15000);
      await driver.findElement(By.xpath("//div[contains(@class, 'btn-light') and text()='1']")).click();
      await driver.sleep(700);

      await waitAndFill(driver, "//input[@formcontrolname='phone']", faker.phone.number("04########"));
      await waitAndFill(driver, "//input[@formcontrolname='email']", faker.internet.email());
      await waitAndFill(driver, "//input[@formcontrolname='password']", "qweqwe");
      await waitAndFill(driver, "//textarea[@formcontrolname='notes'][1]", faker.lorem.sentence());

      await waitAndFill(driver, "//button[normalize-space(text())='SAVE & CONTINUE']", null, false);

      // Property Information
      await driver.findElement(By.xpath("(//button[contains(@class, 'shift-manager-actions__button')])[2]")).click();

      await driver.findElement(By.name("isMortgage")).sendKeys("No");
      await driver.findElement(By.xpath("//select[@formcontrolname='isSuperProperty']")).sendKeys("No");
      await driver.findElement(By.name("propertyName")).sendKeys("Winter House");

      // Property Address
      await driver.findElement(By.xpath("//input[@formcontrolname='address']")).sendKeys("12 Brierly St, Dalgety NSW 2628, Australia");
      await driver.sleep(1000); // wait for suggestions
      await driver.actions().sendKeys(Key.ARROW_DOWN, Key.ENTER).perform();
      await driver.sleep(1000);

      // Property Details
      const ownerOccupiedOption = await driver.wait(until.elementLocated(By.css('select[formcontrolname="ownerOccupiedOrInvestment"] option[value="1: true"]')),5000);
      await ownerOccupiedOption.click();

      const priceInput = await driver.wait(until.elementLocated(By.css('input[formcontrolname="propertyPurchasePrice"]')),5000);
      await priceInput.clear();
      await priceInput.sendKeys('100000');

      const growthInput = await driver.wait(until.elementLocated(By.css('input[formcontrolname="growthRate"]')),5000);
      await growthInput.clear();
      await growthInput.sendKeys('5');

      // Click Update button inside div
      const updateButton = await driver.wait(
        until.elementLocated(By.xpath("//div[@class='text-right py-3']/button[normalize-space(text())='Update']")),
        5000
      );

      await driver.wait(until.elementIsEnabled(updateButton), 5000);
      await driver.sleep(1000);
      await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);
      await driver.executeScript("arguments[0].click();", updateButton);

      // Optional: validate success message
      const successMsg = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(),'success')]")),
        10000
      );
      assert.ok(await successMsg.isDisplayed(), "Success message not displayed");

    } catch (err) {
      // Screenshot on failure
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync('error_screenshot.png', screenshot, 'base64');
      console.error("❌ Test failed. Screenshot saved: error_screenshot.png");
      throw err;
    }
  });
});
