import puppeteer from "puppeteer";
import { AppError } from "../../utils/customError";
import { changeStringToNumber } from "../../utils/sortAndFilterHelpers";
// const puppeteer = require('puppeteer')

export const scrapeStockDetails = async (stock: string): Promise<any> => {
  const url = `https://www.nseindia.com/get-quotes/equity?symbol=${stock}`;

  const browser = await puppeteer.launch({ headless: false });
  
  const page = await browser.newPage();
  try {
    await page.goto(url); // Replace with the actual URL

    const elementHandle: any = await page.waitForSelector("#quoteLtp", {
      visible: true,
    });
    const stockDetails = await elementHandle.evaluate(
      (el: any) => el.textContent
    );
    if (!stockDetails) {
      throw new AppError(
        "Something went wrong... go to NSE India website and pick the correct stock name",
        404
      );
    }
    
    return { stock, ltd: stringToNumber(stockDetails) };
  } catch (error) {
    throw new AppError(
      "Something went wrong... go to NSE India website and pick the correct stock name",
      404
    );
    return null; // Indicate error
  } finally {
    await browser.close(); 
  }
};

const stringToNumber=(n:string)=>{
  const numberValue = parseFloat(n.replace(/,/g, ''))
  return numberValue
}