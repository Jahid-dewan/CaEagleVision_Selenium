import { Builder, By, Browser, until } from "selenium-webdriver";
import { faker } from '@faker-js/faker';

const email = "root@ca.com";
const pass = "qweqwe";

async function Testrun() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    await driver.get("https://caeaglevision-uat.connectauz.com.au/");
    await driver.manage().window().maximize();

    // Login
    await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='username']")), 10000);
    await driver.findElement(By.xpath("//input[@formcontrolname='username']")).sendKeys(email);
    await driver.findElement(By.xpath("//input[@formcontrolname='password']")).sendKeys(pass);
    await driver.findElement(By.xpath("//input[@value='Login']")).click();

    // Navigate to Clients
    const clientsMenuXPath = "//a[@href='/client' and .//span[text()='Clients']]";
    await driver.wait(until.elementLocated(By.xpath(clientsMenuXPath)), 10000);
    await driver.findElement(By.xpath(clientsMenuXPath)).click();

    // Click Add Clients
    const addClientBtnXPath = "//a[@href='/client/add' and contains(., 'Add Clients')]";
    await driver.wait(until.elementLocated(By.xpath(addClientBtnXPath)), 10000);
    await driver.findElement(By.xpath(addClientBtnXPath)).click();

    // ==== Fill Client Info ====
    await driver.wait(until.elementLocated(By.xpath("(//input[@formcontrolname='name'])[1]")), 10000);
    await driver.findElement(By.xpath("(//input[@formcontrolname='name'])[1]")).sendKeys(faker.name.fullName());

    // isSingle
    const isSingle = faker.datatype.boolean();
    const isSingleValue = isSingle ? '0: true' : '1: false';
    await driver.findElement(By.xpath(`//select[@formcontrolname='isSingle']/option[@value='${isSingleValue}']`)).click();

    // Dependents
    await driver.findElement(By.xpath("//input[@formcontrolname='noOfDependent']")).sendKeys(
      faker.datatype.number({ min: 0, max: 5 }).toString()
    );

    // Address
    await driver.findElement(By.xpath("//input[@formcontrolname='address']")).sendKeys(faker.address.streetAddress());

    // State
    const states = [
      'f6714ee6-ad71-446a-aadb-987b6b784b56', // ACT
      'e7b7bf86-c777-41d1-a54f-d00f1edc85e1', // NSW
      'cf2d3a5d-03fd-45f6-8625-ca0fc1446820', // NT
      '5953f7b5-bb6f-489a-8391-1dc45a143c2a', // QLD
      'e8707367-78e6-4d0e-ad1f-9805fcdc39d0', // SA
      '6a4c0246-eeb2-4131-bab5-d8435dc39230', // TAS
      'e7dbaef4-7fb6-4656-9752-6d577761ba42', // VIC
      '510111a7-1350-466c-b372-f4238c0da668'  // WA
    ];
    const randomState = states[Math.floor(Math.random() * states.length)];
    await driver.findElement(By.xpath(`//select[@formcontrolname='stateId']/option[@value='${randomState}']`)).click();

    // ==== Fill First Applicant Info ====

    // Applicant Name (second "name" input)
    await driver.findElement(By.xpath("(//input[@formcontrolname='name'])[2]")).sendKeys(faker.name.fullName());

    // Gender
    const genders = ["Male", "Female", "Other"];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    await driver.findElement(By.xpath(`//select[@formcontrolname='gender']/option[@value='${gender}']`)).click();

    // DOB (20+ years ago)
    const dob = faker.date.birthdate({ min: 20, max: 40, mode: 'age' });
    const dobFormatted = dob.toISOString().split("T")[0].split("-").reverse().join("-"); // dd-mm-yyyy
    const dobInput = await driver.findElement(By.xpath("//input[@formcontrolname='dob']"));
    await driver.executeScript("arguments[0].removeAttribute('readonly')", dobInput);
    await dobInput.clear();
    await dobInput.sendKeys(dobFormatted);

    // Phone (AU format - 10 digits starting with 04 or 03)
    await driver.findElement(By.xpath("//input[@formcontrolname='phone']")).sendKeys(
      faker.phone.number('04########')
    );

    // Email
    await driver.findElement(By.xpath("//input[@formcontrolname='email']")).sendKeys(faker.internet.email());

    // Password
    await driver.findElement(By.xpath("//input[@formcontrolname='password']")).sendKeys("qweqwe");

    // Notes
    await driver.findElement(By.xpath("//textarea[@formcontrolname='notes']")).sendKeys(faker.lorem.sentence());

    // Save & Continue
    await driver.findElement(By.xpath("//button[contains(., 'SAVE')]")).click();

    await driver.sleep(5000); // Wait to observe result (optional)
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await driver.wait();
  }
}

Testrun();
