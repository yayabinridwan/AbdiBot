const Datastore = require('nedb');
const db = {};
db.data = new Datastore('./db/data.db');
 
// You need to load each database (here we do it asynchronously) 
db.data.loadDatabase();

module.exports.storeData = function checkQuery(nama, userId) {
    db.data.find({ userId: userId}, function (err, docs) {
        const schema2 = { dataUser: 'dataUser'
        , userId: userId
        , user: nama
        , status: 'user sudah terdaftar'
        };

       switch(docs) {
            case(docs == ''):
                db.data.insert(schema2, function (err, newDoc) {   
                if (err) {
                    console.log(err);
                } else {
                    console.log('berhasil kuy')
                }// Callback is optional
                // newDoc is the newly inserted document, including its _id
                // newDoc has no key called notToBeSaved since its value was undefined
                })
            default:
                if(docs[0].userId == userId){
                    console.log('user sudah terdaftar')
                }
                else {
                    db.data.insert(schema2, function (err, newDoc) {   
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('berhasil kuy')
                        }// Callback is optional
                        // newDoc is the newly inserted document, including its _id
                        // newDoc has no key called notToBeSaved since its value was undefined
                        })
                }   
       }
      console.log(docs) // If no document is found, docs is equal to []
     })}