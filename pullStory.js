const pdf = require('./generate-PDF.js');
const chapterPuller = require('./pullChapters.js');
const saveStoryJSON = require('./saveStoryJSON.js');

async function pullStory(browser, url, urls) {
    const page = await browser.newPage();
    await page.goto(url);

    console.log("Connecting to " + url + "...");

    const [Ptitle] = await page.$x('/html/body/div[6]/div/div[2]/div[2]/section/div[1]/h1/strong');
    const title = await (await Ptitle.getProperty('textContent')).jsonValue();

    const [Pauthor] = await page.$x('/html/body/div[6]/div/div[2]/div[2]/section/div[1]/div[1]/div/p/a/strong')
    const author = await (await Pauthor.getProperty('textContent')).jsonValue();

    const [Psummary] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[3]')
    const summary = await (await Psummary.getProperty('textContent')).jsonValue();

    const chapters = await chapterPuller(browser, urls);

    
    const story = {
        title: title,
        author: author,
        summary: summary,
        chapters: chapters
    }    


    saveStoryJSON(story);  

}

module.exports = pullStory;
