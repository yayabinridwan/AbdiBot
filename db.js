const Datastore = require('nedb');
db = {};
db.data = new Datastore('./db/data.db');
 
// You need to load each database (here we do it asynchronously) 
db.data.loadDatabase();

function storeData(message, replyToken, source) {
    const schema = { dataUser: 'dataUser'
    , _id: 1
    , user: 'dion'
    , status: 'user sudah terdaftar'
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

exports.module.models = function checkQuery(nama, userId) {
    db.data.find({ user: userId}, function (err, docs) {
       if (docs == ''){
           const schema2 = { dataUser: 'dataUser'
               , _id: userId
               , user: nama
               , status: 'user sudah terdaftar'
               };

           db.data.insert(schema2, function (err, newDoc) {   
           if (err) {
               console.log('gagal');
           } else {
               console.log('berhasil')
           }// Callback is optional
           // newDoc is the newly inserted document, including its _id
           // newDoc has no key called notToBeSaved since its value was undefined
           })
       }
       
       else {
           console.log('user ada')
       }
        // If no document is found, docs is equal to []
     })}