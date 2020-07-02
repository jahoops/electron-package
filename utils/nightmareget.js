const Nightmare = require('nightmare')
const cheerio = require('cheerio')

console.log('in nightmare');

var getData = html => {
    json = {};
    console.log('getData loading cheerio');
    var $ = cheerio.load(html);
    console.log('getData cheerio');
    json.count = $('.srp-controls__count-heading span:first-child').text();
    json.title = $('.srp-controls__count-heading span:last-child').text();     
    console.log('cheerio json',json);
    return json;
};

async function scrapeEbayItem(url) {
    console.log('in Nightmare');
    var nightmare = Nightmare({ show: true });
    console.log('scraping ' + typeof url)
    var scrapedData = await nightmare
        .goto(url)
        .wait('#mainContent')
        .evaluate(selector => {
            return document.querySelector(selector).innerHTML;
            }, '#mainContent')
        .end()
        .then(response => {
            console.log('nightmare response ')
            return getData(response);
        }).catch(err => {
            console.log('nightmare error ' + err);
        });

    scrapedData.link = url; 
    return scrapedData;
}

module.exports.scrapeEbayItem = scrapeEbayItem;