const Nightmare = require('nightmare')
const cheerio = require('cheerio')

console.log('in nightmare');

async function scrapeEbayItem(url) {
    console.log('in Nightmare');
    var nightmare = Nightmare({ show: true });
    console.log('scraping ' + url);
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
    var scrapedData = await nightmare
        .goto('https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=Ann+Sue+-+Twist+and+Freeze&_sacat=0')
        /*.wait('#mainContent')
        .evaluate(selector => {
            return document.querySelector('#mainContent').innerHTML;
        })*/
        //.end()
        .then(response => {
            console.log('nightmare response ',response)
            return getData(response);
        }).catch(err => {
            console.log('nightmare error ' + err);
        });

    scrapedData.link = url; 
    return scrapedData;
}

module.exports.scrapeEbayItem = scrapeEbayItem;