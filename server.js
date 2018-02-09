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
const store = require('./db.js')


 
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
  const fiturCari = await getSearchMes(message, replyToken, source)
  if (fiturCari.length == 0) {
    google.resultsPerPage = 3;
    var nextCounter = 0;
    const searchgoogle = Q.denodeify(google)
    const searchs = () => {return new Promise(function(resolve){resolve(searchgoogle(message.text).then((response) => {
      const searchTitle = response.links[0].link
      return searchTitle;
    }))})}
    const searchse = async () => {return await searchs()}
    const searchakhir = await searchse().then(response => {return response})
    return replyText(replyToken, [`gw saranin cari disni ${searchakhir} , siapa tau ada sob` ])
  } else{
    return replyText(replyToken, ['gw nemu yang lo cari nih', `${fiturCari}`])
  }
}

  



//handel messgaeText
async function handleText(message, replyToken, source) {
  const pesan = message.text.toLowerCase();
  const process = await Tokenizer.splitSentence(pesan);
  const kataKunci = process[0];
  switch (kataKunci) {
     case 'kepoin mantan lewat twitter!':
        return replyText(replyToken, 'fitur ini akan segera hadir');
     case 'info cuaca':
        return replyText(replyToken, 'fitur ini akan segera hadir');
     case 'jadwal sholat':
        return replyText(replyToken, 'fitur ini akan segera hadir');
     case('jadwal kereta'):
        const profile = await client.getProfile(source.userId);
        const nama = profile.displayName
        store.storeData(message, replyToken, source);
        console.log(profile);
     case('hi' || 'hai abdi' || 'hai' || 'halo'):
      if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => replyText(
            replyToken,
            [
              `Halo ${profile.displayName}, ada yang bisa dibantu ga??`,
              'gw bisa cariin kamu info mini ensiklopedia dengan ketik apa yang mau dicari, contoh: tolong cariin! Raisa Andriana. gw juga bisa cariin kamu info gempa coba ketik: info gempa. kalo mau tau info tentng gw coba ketik: info bot',
            ]
          ));
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID');    
        };
     case 'info bot':
        return replyText(replyToken, ['nama gw abdillah, biasanya dipanggil abdi. gw bisa ngasih lo info tentang mini ensiklopedia & info gempa',
      'bot created by: Ankaboet Creative']); 

     case 'info gempa':
        return earthquakeScraping(message, replyToken, source);

     case ('tolong cariin!'):
        return searchFeature(message, replyToken, source)
     
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

np