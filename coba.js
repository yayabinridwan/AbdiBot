const nalapa = require('nalapa').tokenizer
const splitSentences = require('nalapa').splitSentences
const axios = require('axios');
const word = require('nalapa').word
const fs = require('fs')
const kata = {
    stemming: (r) => {
        const stemmed = word.stem(r)
        return console.log(stemmed)
    }
}



const cocok = (pesan) => {
    if(salam.salam.includes(pesan)) {
        return console.log('hai juga')
    }
    else {
        console.log('error')
    }
}

const jorok = ['tai', 'anjing', 'bangsat']

const menoken = {
    fun: async (pesan) => {
        const tokenized = await nalapa.tokenize(pesan)
            if(nlp.nlp.salam.some(salam => pesan.includes(salam))){
                console.log(tokenized)
                return console.log('omongan lo jorok banget sih.')
            }
    }
}


kata.stemming('menyapu')

module.exports.prayerTimes = async function waktuSholat(message) {
    const city = await Tokenizer.splitSentence(message.text);
    const data = await axios.get(`https://time.siswadi.com/pray/?address=${city[1]}`)
    const time = await Object.values(data.data.data);
    time.push(city[1])
    console.log(time)
    return time;
 }

module.exports.nlp = {
    salam: ['hi', 'hai abdi', 'hai', 'pagi abdi', 'pagi', 'siang', 'malam', 'halo']
  }