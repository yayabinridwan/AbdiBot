const nalapa = require('nalapa').tokenizer
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


module.exports.prayerTimes = async function waktuSholat(message) {
    const city = await nalapa.splitSentence(message);
    const jadwal = await axios.get(`https://time.siswadi.com/pray/?address=${city[1]}`)
    const time = await Object.values(jadwal.data.data);
    time.push(city[1])
    console.log(time)
    return time;
 }

module.exports.nlp = {
    salam: ['hi', 'hai abdi', 'hai', 'pagi abdi', 'pagi', 'siang', 'malam', 'halo']
  }

async function jadwalSholat(city) {
    const city1 = city
    const jadwal = await axios.get(`https://time.siswadi.com/pray/?address=${city1}`)
    console.log(Object.values(jadwal.data.data))
}

module.exports.cariQuran = async function quran() {
    const quran = await axios.get('https://api.fathimah.xyz/quran/format/json/acak')
    const hasil = {
        ar: quran.data.acak.ar.teks,
        terjemahan: quran.data.acak.id.teks,
        surat: quran.data.surat.nama,
        ayat: quran.data.surat.nama
    }
    console.log(hasil)
    return hasil;
}
