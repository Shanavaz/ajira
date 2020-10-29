const networkController = require("./network.controller");


exports.routes = function (app) {
    console.log("Network router")

    app.post('/devices', [networkController.createDevice]
    );
    
    app.get('/devices', [networkController.getAllDevices]
    );

    app.put('/devices/:name/strength', [networkController.modifyStrength]
    );
}