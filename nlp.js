/*const nalapa = require('nalapa').tokenizer
const percakapan = require('./coba')

async function nlp(message) {
    const pesan = await message.toLowerCase();
    const tokenized = await nalapa.tokenize(message)
    if(percakapan.nlp.salam.some(salam => tokenized.includes(salam))){
        console.log(tokenized)
        return console.log('hai yaya')
    }else {
        return console.log(err)
    }
}

const menoken = {
    fun: async (pesan) => {
        const tokenized = await nalapa.tokenize(pesan)
            if(nlp.nlp.salam.some(salam => pesan.includes(salam))){
                console.log(tokenized)
                return console.log('omongan lo jorok banget sih.')
            }
    }
}
*/
const Q = require('q')
const ddg = require('ddg-scraper');


async function search(message) {
    const searchddg = Q.denodeify(ddg.search)
    const searchs = () => {return new Promise(function(resolve){resolve(searchddg({q: message, kl: 'id-id', kp: 1, max: 5}).then((urls) => {
      const searchTitle = urls[0]
      console.log(searchTitle);
      return searchTitle;
    }))})}
    const searchse = async () => {return await searchs()};
    const searchakhir = await searchse().then(response => {return response});
}

search('porn');
