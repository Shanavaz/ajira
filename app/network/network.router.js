require('dotenv').config()
const networkController = require("./network.controller");
const path = process.env.CONTEXTPATH

exports.routes = function (app) {
    console.log("Network router")
    console.log(path)
    app.post(path + '/devices', [networkController.createDevice]
    );

    app.get(path + '/devices', [networkController.getAllDevices]
    );

    app.put(path + '/devices/:name/strength', [networkController.modifyStrength]
    );

    app.post(path + '/connections', [networkController.createConnection]
    );
}