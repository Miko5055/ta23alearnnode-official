import axios from "axios";
import * as cheerio from 'cheerio';
import fs from 'fs';

function cacheGet(name) {
    if (fs.existsSync(`./cache/${name}.html`)) {
        return fs.readFileSync(`./cache/${name}.html`, 'utf-8');
    }
    return false;
}

function cacheSet(name, value) {
    if (!fs.existsSync('./cache')) {
        fs.mkdirSync('./cache');
    }
    fs.writeFileSync(`./cache/${name}.html`, value);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    //Kuu peab olema -1 ehk kui oktoober muidu on 10 siis siin peab olema 9
    //Kõige esimene on 2007 Aprill 3
    const startDate = new Date(2025, 5, 12);  
    const endDate = new Date(2025, 3, 3);    

    for (let date = new Date(startDate); date >= endDate; date.setDate(date.getDate() - 1)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const cacheName = `${year}-${month}-${day}`;
        let data = cacheGet(cacheName);

        if (!data) {
            await sleep(50);
            try {
                let res = await axios.get(`https://buttersafe.com/${year}/${month}/${day}`);
                data = res.data;
                cacheSet(cacheName, data);
            } catch (error) {
                continue;
            }
        } else {
            console.log('---------------------------------');
            console.log(`Loaded from cache: ${cacheName}`);
        }

        const $ = cheerio.load(data);
        const comicImg = $('img[src*="/comics/"]');

        if (comicImg.length === 0) {
            console.log(`No comic found for ${cacheName}`);
            console.log('Page title:', $('title').text());
            continue;
        }

        let title = comicImg.attr('alt') || 'No alt found';
        let src = comicImg.attr('src') || 'No src found';
        let text = comicImg.attr('title') || 'No title found';
        
        console.log(title);
        console.log(src);
        console.log(text);
        
    }
}

main();
