const request = require('request'),
    cheerioTableparser = require('cheerio-tableparser');
const cheerio = require('cheerio');
const axios = require('axios');
const base_url = 'http://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg';

module.exports.earthquake = async function earthquakeScrape() {
    let earthquakeScraping = await axios.get(base_url).then((response)=>{
      let $ = cheerio.load(response.data);
      let earthquake = [];
      $('tr', '.table').each( (i, elm) => {
        earthquake.push( {
          number: $(elm).children().first().text(),
          earthquakeTime: {
            time: $(elm).children().eq(1).first().text(),
            location: $(elm).children().eq(2).first().text()
          },
          magnitude: {
            scale: $(elm).children().eq(3).first().text(),
            depth: $(elm).children().eq(4).first().text()
          },
          location: {
            earthquakeLoc: $(elm).children().eq(5).first().text(),
          }
        });
      });
      const earthquakeTime = earthquake[1].earthquakeTime.time
      const earthquakeLocations = earthquake[1].location.earthquakeLoc.substr(0, 50);
      const magnitudes = earthquake[1].magnitude.scale
      const depth = earthquake[1].magnitude.depth
      const earthquakeData = [earthquakeTime, earthquakeLocations, magnitudes, depth]
      return(earthquakeData);
    })
    return earthquakeScraping;
  }