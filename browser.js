const puppeteer = require('puppeteer')

async function newBrowser(){
    return browser = await puppeteer.launch();
}

module.exports = newBrowser; 