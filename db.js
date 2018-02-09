const Datastore = require('nedb');
db = {};
db.data = new Datastore('./db/data.db');
 
// You need to load each database (here we do it asynchronously) 
db.data.loadDatabase();

module.exports.storeData = function storeData(message, replyToken, source) {
    const schema = { dataUser: 'dataUser'
    , _id: source.userId
    , user: profile.displayName
    };

    db.data.insert(schema, function (err, newDoc) {   
    if (err) {
        console.log('gagal');
    } else {
        console.log('berhasil')
    }// Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    })
}

