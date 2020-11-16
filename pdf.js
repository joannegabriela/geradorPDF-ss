const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const texto = require('./texto.json');

function renderTemplate(data, templateName){
    const html = fs.readFileSync(path.join(`${templateName}.hbs`), {
        encoding: "utf8"
    });

   // console.log(data)

    const template = hbs.compile(html);

    const rendered = template(data);

    return rendered;

}

async function createPdf(outputPath, htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // console.log(htmlContent);

    await page.setContent(htmlContent);

   //  console.log("HTML CONTENT: " +htmlContent)

    await page.emulateMediaType("print");
    await page.pdf(
        {path: outputPath, 
        format: "A4", 
        margin: {
            top: "2.5cm",
            right: "2cm",
            bottom: "2cm",
            left: "2.5cm"
        }
    });

    await browser.close();
}


const htmlContent = renderTemplate(texto, "template-PDF");
createPdf("historia.pdf", htmlContent);
