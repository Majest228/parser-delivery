import puppeteer from "puppeteer";
import fs from "fs";

function removeLeadingDigits(str) {
  return str.replace(/^\d+\s*,?\s*/, ""); 
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://armtek.ru/shops");

  const items = await page.$$(".shops__search_list_item.ng-star-inserted");

  const citiesMap = {};

  for (const item of items) {
    const cityElement = await item.$(".font__subtitle1");
    const cityNode = await cityElement.evaluate((node) =>
      node.textContent.trim()
    );

    const shopInfoRows = await item.$$(".shop-info__row.ng-star-inserted");
    const warehouse = {};

    const address = await shopInfoRows[0].evaluate((node) =>
      node.textContent.trim()
    );
    const working_time = await shopInfoRows[2]?.evaluate((node) =>
      node.textContent.trim()
    );
    warehouse.working_time = working_time;

    warehouse.address = removeLeadingDigits(address);
    warehouse.address_full = address;

    let city = cityNode.split(" ").slice(0, 1).join();
    if (!citiesMap[city]) {
      citiesMap[city] = { city, warehouses: [] };
    }

    citiesMap[city].warehouses.push(warehouse);

    const hasPlaceOutlineClass = await shopInfoRows[0].$(
      ".sproit-icon__place-outline"
    );
  }

  await browser.close();

  const citiesArray = Object.values(citiesMap);

  fs.writeFileSync("delivery.json", JSON.stringify(citiesArray, null, 2));

  console.log("Delivery data has been saved to delivery.json");
})();
