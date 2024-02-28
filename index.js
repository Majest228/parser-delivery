import puppeteer from "puppeteer";
import fs from "fs";

function updateAddress(inputStr) {
  return inputStr.replace(/^[\d\s,]+/, ''); 
}
function simplifyAddresses(originalData) {
  return originalData.map(cityData => {
    return {
      city: cityData.city,
      warehouses: cityData.warehouses.map(warehouse => {
        const simplifiedAddress = updateAddress(warehouse.address);
        return {
          working_time: warehouse.working_time,
          address: simplifiedAddress,
          address_full: warehouse.address
        };
      })
    };
  });
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
      node.textContent
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

    warehouse.address = updateAddress(address);
    warehouse.address_full = address;

    let city = cityNode.split(" ").slice(0, 1).join();
    if (city.includes("Нижний")) {
      city = "Нижний Новгород";
    }
    
    if (!citiesMap[city]) {
      citiesMap[city] = { city, warehouses: [] };
    }
    
    citiesMap[city].warehouses.push(warehouse);


  }

  await browser.close();

  const citiesArray = Object.values(citiesMap);

  fs.writeFileSync("delivery.json", JSON.stringify(citiesArray, null, 2));

  console.log("Delivery data has been saved to delivery.json");
})();



