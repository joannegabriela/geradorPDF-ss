const puppeteer = require('puppeteer');
const fs = require('fs');


const url = '';

async function recuperarLinksCapitulos(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector('.boxConteudo');

    let urls = await page.$$eval('tbody > tr', links => {
        links = links.filter(link => link.querySelector('.listagem-textoBg1 > td'));
        links = links.map(el => el.querySelector('a').href)
        return links;
    });

    return urls;
}

async function recuperarHistoria(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(url);

    console.log("Acessando " + url + "...")

    const [Rtitulo] = await page.$x('/html/body/div[6]/div/div[2]/div[2]/section/div[1]/h1/strong');
    const titulo = await (await Rtitulo.getProperty('textContent')).jsonValue();

    const [Rautor] = await page.$x('/html/body/div[6]/div/div[2]/div[2]/section/div[1]/div[1]/div/p/a/strong')
    const autor = await (await Rautor.getProperty('textContent')).jsonValue();

    const [Rsinopse] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[3]')
    const sinopse = await (await Rsinopse.getProperty('textContent')).jsonValue();

    const capitulos = await recuperarCapitulos(await recuperarLinksCapitulos(url))

    const historia = {
        titulo: titulo,
        autor: autor,
        sinopse: sinopse,
        capitulos: capitulos
    }

    fs.writeFile('./texto.json', JSON.stringify(historia), err => err ? console.log(err) : null);

    console.log("pegou");
    
}


async function recuperarCapitulos(urls) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    capitulos = []

    for (link_capitulo in urls) {

        console.log("entrando capitulo: " + link_capitulo)

        var titulo_capitulo = ""
        var notas1 = ""
        var texto = ""
        var notas2 = ""

        var capitulo_imagem = false;

        await page.goto(urls[link_capitulo], {
            waitUntil: 'load',
            timeout: 0
        });


        await page.waitForSelector('.texto-capitulo');

        // verifica se o capítulo tem imagem
        try {
            await page.$eval('.imagemResponsiva', el => el);
            capitulo_imagem = true;
        } catch { }

        // começa aqui

        const [Rverficacao_notas1] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[1]');

        try {
            const verificacao_notas1 = await (await Rverficacao_notas1.getProperty('textContent')).jsonValue();

            if (verificacao_notas1 == "Notas do Autor") { // possui notas iniciais 

                const [Rnotas_iniciais] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[1]')
                notas1 = await (await Rnotas_iniciais.getProperty('textContent')).jsonValue();

                const [Rtitulo] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[2]')
                titulo_capitulo = await (await Rtitulo.getProperty('textContent')).jsonValue();

                // se não tiver imagem
                if (!capitulo_imagem) {
                    [Rtexto] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                    texto = await (await Rtexto.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais 
                    try {
                        [Rnotas2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                        notas2 = await (await Rnotas2.getProperty('textContent')).jsonValue();
                    } catch (err) { }


                    // se tiver imagem
                } else {
                    [Rtexto] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                    texto = await (await Rtexto.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais
                    try {
                        [Rnotas2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[4]')
                        notas2 = await (await Rnotas2.getProperty('textContent')).jsonValue();
                    } catch (err) { }
                }


            } else { // não tem notas iniciais
                const [Rtitulo] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/h2[1]')
                titulo_capitulo = await (await Rtitulo.getProperty('textContent')).jsonValue();

                // se não tiver imagem
                if (!capitulo_imagem) {
                    [Rtexto] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[1]')
                    texto = await (await Rtexto.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais 
                    try {
                        [Rnotas2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                        notas2 = await (await Rnotas2.getProperty('textContent')).jsonValue();
                    } catch (err) { }


                    // se tiver imagem
                } else {
                    [Rtexto] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[2]')
                    texto = await (await Rtexto.getProperty('textContent')).jsonValue();

                    // verifica se tem notas finais
                    try {
                        [Rnotas2] = await page.$x('//*[@id="meio"]/div[2]/section/div[1]/div[2]/div[3]')
                        notas2 = await (await Rnotas2.getProperty('textContent')).jsonValue();
                    } catch (err) { }
                }
            }
        } catch (err) {
            console.log("Não foi possível recuperar o capítulo");
        }

        texto = texto.replace(/(?:\r\n|\r|\n)/g, '<p>');

        const capitulo = {
            titulo: titulo_capitulo,
            notas1: notas1,
            texto: texto,
            notas2: notas2
        }

        capitulos[link_capitulo] = capitulo;
    }

    return capitulos;
}


recuperarHistoria(url);
