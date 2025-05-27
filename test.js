import { Builder, By, Browser, until } from "selenium-webdriver";

const email = "root@ca.com";
const pass = "qweqwe";

async function Testrun() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    console.log("Opening login page...");
    await driver.get("https://caeaglevision-uat.connectauz.com.au/");
    await driver.manage().window().maximize();

    // Wait for the email field and type
    await driver.wait(until.elementLocated(By.xpath("//input[@formcontrolname='username']")), 10000);
    await driver.findElement(By.xpath("//input[@formcontrolname='username']")).sendKeys(email);

    // Password field
    await driver.findElement(By.xpath("//input[@formcontrolname='password']")).sendKeys(pass);

    // Click Login
    await driver.findElement(By.xpath("//input[@value='Login']")).click();

    console.log("✅ Login clicked.");
    await driver.sleep(3000); // Optional
  } catch (err) {
    console.error("❌ Error occurred:", err);
  } finally {
    await driver.quit();
    console.log("🛑 Browser closed.");
  }
}

Testrun();
