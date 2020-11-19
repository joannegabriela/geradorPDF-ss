

async function pullChapters(browser, urls) {
    const page = await browser.newPage();

    chapters = []

    for (chapter_link in urls) {

        console.log("Pulling chapter: " + chapter_link) ;

        var chapter_title = ""
        var notes1 = ""
        var text = ""
        var notes2 = ""

        var image_chapter = false;

        await page.goto(urls[chapter_link], {
            waitUntil: 'load',
            timeout: 0
        });


        await page.waitForSelector('.texto-capitulo');

        try {
            await page.$eval('.imagemResponsiva', el => el);
            image_chapter = true;
        } catch { }


        const [PCheck_notes1] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[1]');

        try {
            const check_notes1 = await (await PCheck_notes1.getProperty('textContent')).jsonValue();

            if (check_notes1 == "Notas do Autor") { 

                const [PNotes1] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[1]')
                notes1 = await (await PNotes1.getProperty('textContent')).jsonValue();

                const [Ptitle] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[2]')
                chapter_title = await (await Ptitle.getProperty('textContent')).jsonValue();

                if (!image_chapter) {
                    [Rtext] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                    text = await (await Rtext.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais 
                    try {
                        [Pnotes2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                        notes2 = await (await Pnotes2.getProperty('textContent')).jsonValue();
                    } catch (err) { }


                } else {
                    [Rtext] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                    text = await (await Rtext.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais
                    try {
                        [Pnotes2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[4]')
                        notes2 = await (await Pnotes2.getProperty('textContent')).jsonValue();
                    } catch (err) { }
                }

            } else { 
                const [Rtitulo] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[1]')
                chapter_title = await (await Rtitulo.getProperty('textContent')).jsonValue();

                // se não tiver imagem
                if (!image_chapter) {
                    [Ptext] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[1]')
                    text = await (await Ptext.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais 
                    try {
                        [PNotes2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                        notes2 = await (await PNotes2.getProperty('textContent')).jsonValue();
                    } catch (err) { }


                    // se tiver imagem
                } else {
                    [Ptext] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                    text = await (await Ptext.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais
                    try {
                        [PNotes2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                        notes2 = await (await PNotes2.getProperty('textContent')).jsonValue();
                    } catch (err) { }
                }
            }
        } catch (err) {
            console.log("Chapter couldn't be pulled\n");
        }

        text = text.replace(/(?:\r\n|\r|\n)/g, '<p>');

        const chapter = {
            title: chapter_title,
            notes1: notes1,
            text: text,
            notes2: notes2
        }

        chapters[chapter_link] = chapter;
    }

    return chapters;
}


module.exports = pullChapters; 