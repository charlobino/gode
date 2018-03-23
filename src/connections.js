const fs = require('fs');

var title = 'gode-connections.json';

var createConfig = (hostname, port) => {
    fs.appendFileSync(title, JSON.stringify({
        connections: [{ id: 1, hostname, port }]
    }));
};

var addConnection = (hostname, port) => {
    if (fs.existsSync(title)) {
        try {
            var connObj = JSON.parse(fs.readFileSync(title));
            var lastId = connObj.connections[connObj.connections.length - 1].id;
            connObj.connections.push({
                id: lastId + 1,
                hostname: hostname,
                port: port
            });
            fs.writeFileSync(title, JSON.stringify(connObj));
        } catch (err) {
            createConfig(hostname, port);
        }
    } else { createConfig(hostname, port); }
};

var deleteConnection = (id) => {
    var connJson = JSON.parse(fs.readFileSync(title));
    // ...
    fs.writeFileSync(title, JSON.stringify(connJson));
};

addConnection('allo', '123123');





// var addConnection = (hostname, port) => {
//     try {
//         var connJson = JSON.parse(fs.readFileSync(title));
//         var lastId = connJson.connections[connJson.connections.length - 1].id;
//         connJson.connections.push({
//             id: lastId + 1,
//             hostname: hostname,
//             port: port
//         });
//         fs.writeFileSync(title, JSON.stringify(connJson));
//     } catch (err) {
//         fs.appendFileSync(title, JSON.stringify({
//             connections: [
//                 {
//                     id: 0,
//                     hostname: hostname,
//                     port: port
//                 }
//             ]
//         }));
//     }
// };