const puppeteer = require('puppeteer')

async function scrapeEbayItem(url) {
    console.log('scraping ' + url)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(url)

    const scrapedData = await page.evaluate(function(){
        const json = {};
        json.count = document.querySelector('#mainContent .srp-controls__count-heading span:first-child').textContent;
        json.title = document.querySelector('#mainContent .srp-controls__count-heading span:last-child').textContent;
        return json;
    });

    await browser.close()
    scrapedData.link = url;
    return scrapedData
}

module.exports.scrapeEbayItem = scrapeEbayItem