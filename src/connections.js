const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const configFile = 'gode-connections.json';
const logFile = 'queries-log.log';

var date = new Date().toString();

var createConfig = (name, address, port) => {
    fs.writeFileSync(configFile, JSON.stringify({
        connections: [{ id: 1, name, address, port }]
    }, null, 4));
    fs.appendFileSync(logFile, `SUCCESS:${date}: connection #${1}(${name}) added \n`);
};

var addConnection = (name, address, port) => {
    if (fs.existsSync(configFile)) {
        var connObj = JSON.parse(fs.readFileSync(configFile));
        var nextId = connObj.connections[connObj.connections.length - 1].id + 1;
        connObj.connections.push({
            id: nextId,
            name: name,
            address: address,
            port: port
        });
        fs.writeFileSync(configFile, JSON.stringify(connObj, null, 4));
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
    fs.writeFileSync(configFile, JSON.stringify(connObj, null, 4));
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
    fs.writeFileSync(configFile, JSON.stringify(connObj, null, 4));
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
