const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const title = 'gode-connections.json';

var createDatabase = (address, port, dbName, collectName) => {
    var url = `mongodb://${address}:${port}/${dbName}`;
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return console.log(`ERROR: ${dbName}`);
        } else {
            console.log(`SUCCESS: ${dbName}`);

            const db = client.db(dbName);

            db.collection('default').insertOne({}, (err, result) => {
                if (err) {
                    return console.log(`ERROR: ${collectName}`);
                }
            });
        }
        client.close();
    });
}

var createConfig = (name, address, port) => {
    fs.appendFileSync(title, JSON.stringify({
        connections: [{ id: 1, name, address, port }]
    }));
};

var addConnection = (name, address, port) => {
    if (fs.existsSync(title)) {
        try {
            var connObj = JSON.parse(fs.readFileSync(title));
            var lastId = connObj.connections[connObj.connections.length - 1].id;
            connObj.connections.push({
                id: lastId + 1,
                name: name,
                address: address,
                port: port
            });
            fs.writeFileSync(title, JSON.stringify(connObj));
        } catch (err) {
            createConfig(name, address, port);
        }
    } else { createConfig(name, address, port); }
};

var deleteConnection = (id) => {
    var connObj = JSON.parse(fs.readFileSync(title));
    connObj.connections.forEach(element => {
        if (element.id === id) {
            connObj.connections.splice(connObj.connections.indexOf(element), 1);
        }
    });
    fs.writeFileSync(title, JSON.stringify(connObj));
};

var modifyConnection = (id, newName, newAddress, newPort) => {
    var connObj = JSON.parse(fs.readFileSync(title));
    connObj.connections.forEach(element => {
        if (element.id === id) {
            element.name = newName;
            element.address = newAddress;
            element.port = newPort;
        }
    });
    fs.writeFileSync(title, JSON.stringify(connObj));
};

//modifyConnection(2, 'HomeConnection', '127.0.0.1','3000');
//deleteConnection(1);
//addConnection('LocalConnection','localhost', '27017');
createDatabase('localhost', '27017', 'FirstDB', 'FirstCollection');