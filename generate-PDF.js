const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const data = require('./JSON/JSONStory.json');
const browser = require('./browser.js');


function renderTemplate(data) {
    const html = fs.readFileSync(path.join('./template-PDF.hbs'), {
        encoding: "utf8"
    });

    const template = hbs.compile(html);
    return rendered = template(data);
}

const htmlContent = renderTemplate(data);

async function editPdf(browser, outputPath, htmlContent) {
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.emulateMediaType("print");

    await page.pdf({
        path: outputPath,
        format: "A4",
        margin: {
            top: "2.5cm",
            right: "2cm",
            bottom: "2cm",
            left: "2.5cm"
        }
    });

}


async function generatePDF(){
    const browser_instance = await browser();
    const pdf_story = await editPdf(browser_instance, `./PDFs/${data.title} - ${data.author}.pdf`, htmlContent);
    browser_instance.close();
    return pdf_story;

    
}

generatePDF();

// module.exports = generatePDF;

