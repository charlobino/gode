const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const configFile = 'gode-connections.json';
const logFile = 'queries-log.log';

var date = new Date().toString();

var createConfig = (name, address, port) => {
    fs.writeFileSync(configFile, JSON.stringify({
        connections: [{ id: 1, name, address, port }]
    }));
};

var addConnection = (name, address, port) => {
    if (fs.existsSync(configFile)) {
        var connObj = JSON.parse(fs.readFileSync(configFile));
        var nextId = connObj.connections[connObj.connections.length - 1].id+1;
        connObj.connections.push({
            id: nextId,
            name: name,
            address: address,
            port: port
        });
        fs.writeFileSync(configFile, JSON.stringify(connObj));
        fs.appendFileSync(logFile, `SUCCESS:${date}: connection #${nextId}(${name}) added \n`);
    } else { createConfig(name, address, port); }
};
//addConnection('LocalConnection', 'localhost', '27017');

var modifyConnection = (id, newName, newAddress, newPort) => {
    var connObj = JSON.parse(fs.readFileSync(configFile));
    connObj.connections.forEach(element => {
        if (element.id === id) {
            element.name = newName;
            element.address = newAddress;
            element.port = newPort;
            fs.appendFileSync(logFile, `SUCCESS:${date}: connection #${element.id}(${element.name}) modified \n`);
        }
    });
    fs.writeFileSync(configFile, JSON.stringify(connObj));
};
//modifyConnection(2, 'HomeConnection', '127.0.0.1','3000');

var deleteConnection = (id) => {
    var connObj = JSON.parse(fs.readFileSync(configFile));
    connObj.connections.forEach(element => {
        if (element.id === id) {
            connObj.connections.splice(connObj.connections.indexOf(element), 1);
            fs.appendFileSync(logFile, `SUCCESS:${date}: connection #${element.id}(${element.name}) deleted \n`);
        }
    });
    fs.writeFileSync(configFile, JSON.stringify(connObj));
};
//deleteConnection(5);

var checkConnState = (address, port) => {
    var url = `mongodb://${address}:${port}/admin`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile, `ERROR:${date}: connection lost with ${url} \n`);
            return false;
        }
        else {
            client.close();
            return true;
        }
    });
};
//checkConnState('localhost', '27017');

var getDatabases = (address, port) => {

};
//getDatabases('localhost','27017');

var createDatabase = (address, port, dbName, collectName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(`ERROR:${date}: cant create database ${dbName} \n`);
        } else {
            const db = client.db(dbName);
            db.collection(collectName).insertOne({}, (err, result) => {
                if (err) {
                    fs.appendFileSync(logFile,`ERROR:${date}: cant create collection ${collectName} \n`);
                } else {
                    fs.appendFileSync(logFile,`SUCCESS:${date}: database ${dbName} created \n`);
                }
            });
        }
        client.close();
    });
};
//createDatabase('localhost', '27017', 'TestDB', 'TestColl');

var deleteDatabase = (address, port, dbName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            const db = client.db(dbName);
            db.dropDatabase((err, result) => {
                if (err) {
                    fs.appendFileSync(logFile,`ERROR:${date}: cant delete database ${dbName} \n`);
                } else {
                    fs.appendFileSync(logFile,`SUCCESS:${date}: database ${dbName} deleted \n`);
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
            fs.appendFileSync(logFile,`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            console.log(`SUCCESS:${date}: ${dbName}`);

            const db = client.db(dbName);
            db.listCollections().toArray(function(err, collInfos) {
                console.log(collInfos);
            });
        }
        client.close();
    });
};
//getCollections('localhost', '27017','TestDB');

var addCollection = (address, port, dbName, collName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile,`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            fs.appendFileSync(logFile,`SUCCESS:${date}: collection ${collName} added \n`);

            const db = client.db(dbName);

            const coll = client.db(dbName).collection(collName);
            coll.insertOne({default:'value'});
        }
        client.close();
    });
};
//addCollection('localhost', '27017','TodoApp','TestColl');

var deleteCollection = (address, port, dbName, collName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile,`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            fs.appendFileSync(logFile,`SUCCESS:${date}: collection ${collName} deleted \n`);

            const db = client.db(dbName);

            const coll = client.db(dbName).collection(collName);
            coll.remove();
            coll.drop(); // Deprecated
        }
        client.close();
    });
};
//deleteCollection('localhost', '27017','TodoApp','TestColl');

var addDocuments = (address, port, dbName, collName, documents) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile,`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            fs.appendFileSync(logFile,`SUCCESS:${date}: ${documents} added \n`);
            var docObj = documents;
            const db = client.db(dbName);

            const coll = client.db(dbName).collection(collName);
            coll.insert(docObj);
        }
        client.close();
    });
};
// addDocuments('localhost', '27017','TodoApp','TestColl',{
//     this:'is',
//     a:'document to delete'
// });

var deleteDocuments = (address, port, dbName, collName, documents) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            fs.appendFileSync(logFile,`ERROR:${date}: cant connect to database ${dbName} \n`);
        } else {
            fs.appendFileSync(logFile,`SUCCESS:${date}: ${documents} deleted \n`);
            var docObj = documents;
            const db = client.db(dbName);

            const coll = client.db(dbName).collection(collName);
            coll.deleteMany(docObj);
        }
        client.close();
    });
};
// deleteDocuments('localhost', '27017','TodoApp','TestColl',{
//     this:'is',
//     a:'document to delete'
// });
