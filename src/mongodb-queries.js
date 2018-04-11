const fs = require('fs');
const { MongoClient, ObjectID } = require('mongodb');

const logFile = 'queries-log.log';

var date = new Date().toString();

var getDatabases = (address, port, dbName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            var adminDb = client.db(dbName).admin();
            adminDb.listDatabases((err, result) => {
                if (err) {
                    console.log(err);
                    fs.appendFileSync(logFile, `ERROR:${date}: unable to fetch databases \n`);
                } else {
                    console.log(result);
                }
            });
        }
        client.close();
    });
};
//getDatabases('localhost', '27017', 'FirstDB');

var createDatabase = (address, port, dbName, collectName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            db.collection(collectName).insertOne({}, (err, result) => {
                if (err) {
                    fs.appendFileSync(logFile, `ERROR:${date}: cant create collection ${collectName} \n`);
                } else {
                    fs.appendFileSync(logFile, `SUCCESS:${date}: database ${dbName} created \n`);
                }
            });
        }
        client.close();
    });
};
//createDatabase('localhost', '27017', 'FirstDB', 'FirstColl');

var deleteDatabase = (address, port, dbName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            db.dropDatabase((err, result) => {
                if (err) {
                    fs.appendFileSync(logFile, `ERROR:${date}: cant delete database ${dbName} \n`);
                } else {
                    fs.appendFileSync(logFile, `SUCCESS:${date}: database ${dbName} deleted \n`);
                }
            });
        }
        client.close();
    });
};
//deleteDatabase('localhost', '27017', 'TestDB');

var getCollections = (address, port, dbName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);

            db.collectionNames((err, collections) => {
                if (err) {
                    fs.appendFileSync(logFile, `ERROR:${date}: unable to fetch collections from ${dbName} \n`);
                } else {
                    console.log(collections);
                }
            });

        }
        client.close();
    });
};
//getCollections('localhost', '27017','FirstDB');

var addCollection = (address, port, dbName, collName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            coll.insertOne({});
            fs.appendFileSync(logFile, `SUCCESS:${date}: collection ${collName} added \n`);
        }
        client.close();
    });
};
//addCollection('localhost', '27017', 'FirstDB', 'SecondColl');

var deleteCollection = (address, port, dbName, collName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            coll.remove();
            coll.drop(); // Deprecated
            fs.appendFileSync(logFile, `SUCCESS:${date}: collection ${collName} deleted \n`);
        }
        client.close();
    });
};
//deleteCollection('localhost', '27017','TestDB','TestColl');

var getDocuments = (address, port, dbName, collName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);

            coll.find().toArray().then((docs) => {
                console.log(JSON.stringify(docs, undefined, 2));
            }, (err) => {
                fs.appendFileSync(logFile, `ERROR:${date}: unable to fetch documents from /${dbName}/${collName} \n`);
            });
        }
        client.close();
    });
};
//getDocuments('localhost', '27017','FirstDB','FirstColl');

var addDocuments = (address, port, dbName, collName, documents) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            coll.insert(documents);
            fs.appendFileSync(logFile, `SUCCESS:${date}: ${documents} added \n`);
        }
        client.close();
    });
};
// addDocuments('localhost', '27017','FirstDB','FirstColl',[{
//     this:'is',
//     a:'document to delete'
// },{
//     this:'is',
//     another:'document to delete'
// }]);

var deleteManyDocs = (address, port, dbName, collName, documents) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            coll.deleteMany(documents);
            fs.appendFileSync(logFile, `SUCCESS:${date}: ${documents} deleted \n`);
        }
        client.close();
    });
};
// deleteManyDocs('localhost', '27017','TestDB','TestColl',{
//     this:'is',
//     a:'document to delete'
// });

var deleteOneDoc = (address, port, dbName, collName, filter) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            if (filter._id) {
                filter = { _id: new ObjectID(filter._id) };
            }
            coll.findOneAndDelete(filter).then((results) => {
                fs.appendFileSync(logFile, `SUCCESS:${date}: document ${JSON.stringify(results, undefined, 0)} deleted \n`);
            });
        }
        client.close();
    });
};
// deleteOneDoc('localhost', '27017','FirstDB','FirstColl',{
//     _id:'5ace2badcfb62117d480f8a4'
// });

var updateOneDoc = (address, port, dbName, collName, filter, newValue) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            if (filter._id) {
                filter = { _id: new ObjectID(filter._id) };
            }
            coll.findOneAndUpdate(filter, { $set: newValue }, { returnOriginal: false }).then((result) => {
                fs.appendFileSync(logFile, `SUCCESS:${date}: document ${result} updated \n`);
            });
        }
        client.close();
    });
};
// updateOneDoc('localhost', '27017','FirstDB','FirstColl',{
//     a: 'document to delete'
// },{
//     this:'is possibly'
// });

var updateManyDocs = (address, port, dbName, collName, filter, newValue) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            coll.updateMany(filter, { $set: newValue }, { returnOriginal: false }).then((result) => {
                fs.appendFileSync(logFile, `SUCCESS:${date}: documents ${result} updated \n`);
            });
        }
        client.close();
    });
};
// updateManyDocs('localhost', '27017','FirstDB','FirstColl',{
//     a: 'document to delete'
// },{
//     this:'is possibly'
// });

var cloneDocuments = (address, port, dbName, collName, filter, nbClone) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: unable to connect to server \n`);
        } else {
            const db = client.db(dbName);
            const coll = client.db(dbName).collection(collName);
            if (filter._id) {
                filter = { _id: new ObjectID(filter._id) };
            }
            coll.find(filter).toArray().then((docs) => {
                for (var i = 0; i < nbClone; ++i) {
                    coll.insertOne(docs);
                    // ...
                }
            }, (err) => {
                if (err) {
                    fs.appendFileSync(logFile, `ERROR:${date}: unable to fetch from /${dbName}/${collName} \n`);
                } else {
                    fs.appendFileSync(logFile, `SUCCESS:${date}: document(s) successfully cloned ${nbClone} times \n`);
                }
            });
        }
        client.close();
    });
};
// cloneDocuments('localhost', '27017','FirstDB','FirstColl',{_id:'5ace2c245ca06c25e49ee07d'},1);