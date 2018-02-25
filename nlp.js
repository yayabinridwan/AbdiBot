const nalapa = require('nalapa').tokenizer
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
