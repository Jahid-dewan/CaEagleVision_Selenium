// @ts-nocheck
import { Builder, By, Browser, until, Key } from "selenium-webdriver";
import { faker } from "@faker-js/faker";

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
  // Small delay to ensure UI catches up
  await driver.sleep(700);
  return element;
}

async function Testrun() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    await driver.get("https://caeaglevision-uat.connectauz.com.au/");
    await driver.manage().window().maximize();

    // Login form
    await waitAndFill(driver, "//input[@formcontrolname='username']", email);
    await waitAndFill(driver, "//input[@formcontrolname='password']", pass);
    await waitAndFill(driver, "//input[@value='Login']", null, false);

    // Navigate to Clients menu
    const clientsMenuXPath = "//a[@href='/client' and .//span[text()='Clients']]";
    await waitAndFill(driver, clientsMenuXPath, null, false);

    // Click Add Clients button
    const addClientBtnXPath = "//a[@href='/client/add' and contains(., 'Add Clients')]";
    await waitAndFill(driver, addClientBtnXPath, null, false);

    // === Fill Client Info ===
    await waitAndFill(driver, "(//input[@formcontrolname='name'])[1]", faker.name.fullName());

    // isSingle select - random between "0: true" and "1: false"
    const isSingleValue = faker.datatype.boolean() ? "0: true" : "1: false";
    await waitAndFill(driver, `//select[@formcontrolname='isSingle']/option[@value='${isSingleValue}']`, null, false);

    await waitAndFill(driver, "//input[@formcontrolname='noOfDependent']", faker.datatype.number({ min: 0, max: 5 }).toString());
    await waitAndFill(driver, "//input[@formcontrolname='address']", faker.address.streetAddress());

    const states = [
      'f6714ee6-ad71-446a-aadb-987b6b784b56', 'e7b7bf86-c777-41d1-a54f-d00f1edc85e1',
      'cf2d3a5d-03fd-45f6-8625-ca0fc1446820', '5953f7b5-bb6f-489a-8391-1dc45a143c2a',
      'e8707367-78e6-4d0e-ad1f-9805fcdc39d0', '6a4c0246-eeb2-4131-bab5-d8435dc39230',
      'e7dbaef4-7fb6-4656-9752-6d577761ba42', '510111a7-1350-466c-b372-f4238c0da668'
    ];
    const randomState = states[Math.floor(Math.random() * states.length)];
    await waitAndFill(driver, `//select[@formcontrolname='stateId']/option[@value='${randomState}']`, null, false);

    // === First Applicant ===
    await waitAndFill(driver, "(//input[@formcontrolname='name'])[2]", faker.name.fullName());

    const genderOptions = ["Male", "Female", "Other"];
    const gender = genderOptions[Math.floor(Math.random() * genderOptions.length)];
    await waitAndFill(driver, `(//select[@formcontrolname='gender'])[1]/option[@value='${gender}']`, null, false);

    // DOB picker for first applicant
    const dobInput1 = await waitAndFill(driver, "(//input[@formcontrolname='dob'])[1]", null, false);
    // Wait for datepicker and pick day 16 (if visible)
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'btn-light') and text()='1']")), 15000);
    const dobDay1 = await driver.findElement(By.xpath("//div[contains(@class, 'btn-light') and text()='1']"));
    await dobDay1.click();
    await driver.sleep(700);

    await waitAndFill(driver, "//input[@formcontrolname='phone']", faker.phone.number("04########"));
    await waitAndFill(driver, "//input[@formcontrolname='email']", faker.internet.email());
    await waitAndFill(driver, "//input[@formcontrolname='password']", "qweqwe");
    await waitAndFill(driver, "//textarea[@formcontrolname='notes'][1]", faker.lorem.sentence());

    await waitAndFill(driver, "//button[normalize-space(text())='SAVE & CONTINUE']", null, false);
   

  //Property Information
await driver.findElement(By.xpath("(//button[contains(@class, 'shift-manager-actions__button')])[2]")).click();

// select "No"
await driver.findElement(By.name("isMortgage")).sendKeys("No");
await driver.findElement(By.xpath("//select[@formcontrolname='isSuperProperty']")).sendKeys("No");
await driver.findElement(By.name("propertyName")).sendKeys("Winter House");

//Property Address
await driver.findElement(By.xpath("//input[@formcontrolname='address']")).sendKeys("12 Brierly St, Dalgety NSW 2628, Australia");
 await driver.sleep(1000); // wait for suggestions
await driver.actions().sendKeys(Key.ARROW_DOWN, Key.ENTER).perform();
 await driver.sleep(1000);
// Fill property details
const ownerOccupiedOption = await driver.wait(until.elementLocated(By.css('select[formcontrolname="ownerOccupiedOrInvestment"] option[value="1: true"]')),5000
);
await ownerOccupiedOption.click();

// Fill Property Purchase Price 
const priceInput = await driver.wait(
    until.elementLocated(By.css('input[formcontrolname="propertyPurchasePrice"]')),
    5000
);
await priceInput.clear();
await priceInput.sendKeys('100000');

// Fill Growth Rate (hard-coded)
const growthInput = await driver.wait(
    until.elementLocated(By.css('input[formcontrolname="growthRate"]')),
    5000
);
await growthInput.clear();
await growthInput.sendKeys('5');

// Click Update button
// Locate the Update button inside the specific div
const updateButton = await driver.wait(
    until.elementLocated(By.xpath("//div[@class='text-right py-3']/button[normalize-space(text())='Update']")),
    5000
);

// Scroll into view
await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);

// Click using JavaScript
    await driver.sleep(5000);

await driver.executeScript("arguments[0].click();", updateButton);

    // Final wait to let submission complete
    await driver.sleep(1000);
  } catch (err) {
    console.error("❌ Error during test run:", err.message, err.stack);
  } finally {
    await driver.wait();
  }
}

Testrun();