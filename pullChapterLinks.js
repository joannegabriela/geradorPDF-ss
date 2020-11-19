const browser = require('./browser.js');
const storyPuller = require('./pullStory.js');
const pdf = require('./generate-PDF.js')

async function pullChapterLinks(url) {
    const browser_instance = await browser();
    const page = await browser_instance.newPage();

    await page.goto(url);

    await page.waitForSelector('.boxConteudo');

    let urls = await page.$$eval('tbody > tr', links => {
        links = links.filter(link => link.querySelector('.listagem-textoBg1 > td'));
        links = links.map(el => el.querySelector('a').href)
        return links;
    });


    await storyPuller(browser_instance, url, urls);

    browser_instance.close();

    
}


module.exports = pullChapterLinks;


