'use strict';

//module

const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
const cp = require('child-process-promise');
const config = {
  channelAccessToken: "bP51u0Q7bORxv5Eh4Z3kP4SoDLEqP+ysPnqxCRy9oZwjsSoQHTviSLk7BVbapb0PFXhkniJpz9wAqGpDp+4J2MhuZmrmZWCizhSBXllUKuonnx81ESGGkB8CDJiwqIk64DK4E1V6+nqePqEQSWpRagdB04t89/1O/w1cDnyilFU=" ,
  channelSecret: "056b3f3a932f10d7f86011989907f0ac",
};
const request = require('request'),
    cheerioTableparser = require('cheerio-tableparser');
const request1 = require('request-promise');
const cheerio = require('cheerio');
const scrape = require('./lib/scrapeGempa.js');
// create LINE SDK client

const client = new line.Client(config);
const google = require("google")
//create express serve
const app = express();
const util = require('util');
const Q = require('q');
const Tokenizer = require('nalapa').tokenizer;
const Datastore = require('nedb');
const store = require('./db.js');
const nlp = require('./coba')
const ddg = require('ddg-scraper');


 
// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    console.log(JSON.stringify(req.body))
 
});


//replyMessage
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

//handle searchmessage
async function getSearchMes(message, replyToken, source) {
    try {
      const pesanCari = await Tokenizer.splitSentence(message.text)
      const query = await pesanCari[1];
      const search = await  axios(`http://api.duckduckgo.com/?q=${query}&format=json&pretty=1`)
      const hasilSearch = search.data.Abstract;
      const hasilImg = search.data.Image;
      const url = "https://translate.google.com/translate_a/single"
      + "?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=es-ES&ie=UTF-8"
      + "&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e";
      const data = {
        'sl': 'en',
        'tl': 'id',
        'q': hasilSearch,
      };
      const opt = {
        method: 'POST',
        uri: url,
        encoding: 'UTF-8',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
        },
        form: data,
        json: true,
      };
      const responseHasil = await request1(opt);
      console.log(JSON.stringify(responseHasil));
      const terjemahan = responseHasil.sentences[0].trans
      return terjemahan;
    }
    catch(e) {
      console.error(e);
    }
  }

  // earthquake scraping
async function earthquakeScraping(message, replyToken, source) {
    const earthquakeScraped = await scrape.earthquake();
    return replyText(replyToken, ['FYI', `telah terjadi gempa di ${earthquakeScraped[1]} pada ${earthquakeScraped[0]} dengan kekuatan gempa sebessar ${earthquakeScraped[2]} Skala Richter pada kedalaman ${earthquakeScraped[3]}`, 'sumber: bmkg.go.id'])
}

//earthquake feature
async function searchFeature(message, replyToken, source){
  const queryddg = message.text.toLowerCase();
  const process = await Tokenizer.splitSentence(queryddg);
  const fiturCari = await getSearchMes(message, replyToken, source)
  if (fiturCari.length == 0) {
    const searchddg = Q.denodeify(ddg.search)
    const searchs = () => {return new Promise(function(resolve){resolve(searchddg({q: process[1], kl: 'id-id', kp: 1, max: 5}).then((urls) => {
      const searchTitle = urls[0]
      return searchTitle;
    }))})}
    const searchse = async () => {return await searchs()};
    const searchakhir = await searchse().then(response => {return response});
    if (searchakhir = '/l/?kh=-1&uddg=') {
      return replyText(replyToken, 'wah lo nyari yang begituan ya. Sorry bro, kalo yang begituan ga ada')
    } else {
      return replyText(replyToken, [`gw saranin cari disni ${searchakhir} , siapa tau ada sob` ])
    }
  } else{
    return replyText(replyToken, ['gw nemu yang lo cari nih', `${fiturCari}`])
  }
}

async function prayerTimes(message, replyToken, source) {
  try{
    const time = await nlp.prayerTimes(message);
    return replyText(replyToken, [
      `Waktu sholat kota ${time[11]}:\n
      Subuh:${time[0]}
      Sunrise:${time[1]}
      Dzuhur:${time[2]}
      Ashar:${time[3]}
      Sunset:${time[4]}
      Maghrib:${time[5]}
      Sepertig amalam:${time[6]}
      Tengah Malam:${time[7]}
      Duapertiga malam:${time[0]} `, 
      `Dari Ummu Farwah, ia berkata, “Rasulullah shallallahu ‘alaihi wa sallam pernah ditanya, amalan apakah yang paling afdhol. Beliau pun menjawab, “Shalat di awal waktunya.” (HR. Abu Daud no. 426. Syaikh Al Albani mengatakan bahwa hadits ini shahih)
      `, 
      `Yuk sob! sholat di awal waktu`
    ])
  }
  catch (e) {
    console.log(e);
  }
}



//handel messgaeText
async function handleText(message, replyToken, source) {
  const pesan = message.text.toLowerCase();
  const tokenizedd = await Tokenizer.tokenize(pesan)
  const process = await Tokenizer.splitSentence(pesan);
  const kataKunci = process[0];
  switch (kataKunci) {
     case 'kepoin mantan lewat twitter!':
        return replyText(replyToken, 'fitur ini akan segera hadir');
     case 'info cuaca':
        return replyText(replyToken, 'fitur ini akan segera hadir');
     case('daftar'):
        const profile = await client.getProfile(source.userId).then((result) => {return result})
        const nama = await profile.displayName
        const userId = await profile.userId
        store.storeData(nama, userId);
        return console.log('data berhasil diterima ')
     case(nlp.nlp.salam.some(salam => tokenizedd.includes(salam))):
      if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => replyText(
            replyToken,
            [
              `Halo ${profile.displayName}, ada yang bisa dibantu ga??`,
              `Gw bisa bantuin lo cari info-info kayak info ensiklopediaa, info gempa sama info jadwal sholat..\n
              Caranya:\n
              Info ensiklopedia ketik: Tolong cariin! (apa aja yang kamu mau)\n
              Info gempa ketik: Info gempa\n
              Info Jadwal sholat ketik: Infoin jadwal sholat! nama kota\n
              Kalo masih belum ngerti bisa ketik: bantuan`
            ]
          ));
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID');    
        };
     case 'info bot':
        return replyText(replyToken, ['nama gw abdillah, biasanya dipanggil abdi. gw bisa ngasih lo info tentang mini ensiklopedia, info gempa, & info jadwal sholat',
      'bot created by: Ankaboet Creative']); 
     
     case 'bantuan' :
     if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => replyText(
            replyToken,
            [
              `Halo ${profile.displayName}, ada yang bisa dibantu ga??`,
              `Gw bisa bantuin lo cari info-info kayak info ensiklopediaa, info gempa sama info jadwal sholat..\n
              Caranya:\n
              Info ensiklopedia ketik: Tolong cariin! (apa aja yang kamu mau)\n
              Info gempa ketik: Info gempa\n
              Info Jdwal sholat ketik: Infoin jadwal sholat! nama kota`
            ]
          ));
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID');    
        };

     case 'info gempa':
        return earthquakeScraping(message, replyToken, source);

     case ('tolong cariin!'):
        return searchFeature(message, replyToken, source);

     case 'infoin waktu sholat!':
        return prayerTimes(message, replyToken, source)
     
     case(process[1] == 'jodoh'):
        return replyText(replyToken, 'Santai sob! jodoh pasti bertemu')
     
     default:
         return console.log(process)
  }
}
// listen on port
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}


const port = 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);

    });

