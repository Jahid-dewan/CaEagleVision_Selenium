import { Builder, By, Browser, until } from "selenium-webdriver";
import { faker } from "@faker-js/faker";

const Client = "JahidD0";
const Pass = "qweqwe";

async function Testrun() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    console.log("Opening login page...");
    await driver.get("https://capos-uat.connectauz.com.au/");
    await driver.manage().window().maximize();

    // Login
    console.log("Entering username and password...");
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='username']")), 10000);
    await usernameInput.sendKeys(Client);

    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='password']")), 10000);
    await passwordInput.sendKeys(Pass);

    const loginBtn = await driver.wait(until.elementLocated(By.xpath("//input[@type='submit' and @value='Login']")), 10000);
    await driver.wait(until.elementIsEnabled(loginBtn), 10000);

    console.log("Clicking login...");
    await loginBtn.click();

    await driver.wait(until.urlContains("dashboard"), 10000);
    console.log("Login successful, on dashboard.");

    // Navigate to "Clients"
    console.log("Navigating to Clients menu...");
    const clientsMenu = await driver.wait(until.elementLocated(By.xpath("//a[span[text()='Clients']]")), 10000);
    await clientsMenu.click();

    // Navigate to "Add Clients"
    console.log("Navigating to Add Clients...");
    const addClientsBtn = await driver.wait(until.elementLocated(By.xpath("//a[@href='/client/add']")), 10000);
    await addClientsBtn.click();

    // Fill Client Basic Info with faker data
    const clientName = faker.name.fullName();
    const phone = faker.phone.phoneNumber('04########');
    const email = faker.internet.email();

    console.log("Filling client basic info...");
    const nameInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='name']")), 10000);
    await nameInput.sendKeys(clientName);

    const phoneInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='mobile']")), 10000);
    await phoneInput.sendKeys(phone);

    const emailInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='email']")), 10000);
    await emailInput.sendKeys(email);

    // Fill applicantName if visible
    try {
      const applicantName = faker.name.fullName();
      const applicantInput = await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='applicantName']")), 5000);
      await applicantInput.sendKeys(applicantName);
      console.log("Applicant name filled.");
    } catch {
      console.log("Applicant name field not found, skipping.");
    }

    // Click Save button if available
    try {
      const saveBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Save')]")), 5000);
      await saveBtn.click();
      console.log("Form submitted!");
    } catch {
      console.log("Save button not found or skipped.");
    }

    // Optional wait to observe
    await driver.sleep(3000);

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await driver.quit();
  }
}

Testrun();
