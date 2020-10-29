const networkService = require('./network.service')

exports.createDevice = async (req, res) => {
    try {
        await networkService.createDevice(req, res)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            data: []
        });
    }
}

exports.getAllDevices = async (req, res) => {
    try {
        await networkService.getAllDevices(req, res)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            data: []
        });
    }
}

exports.modifyStrength = async (req, res) => {
    try {
        await networkService.modifyStrength(req, res)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            data: []
        });
    }
}

exports.createConnection = async (req, res) => {
    try {
        await networkService.createConnection(req, res)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            data: []
        });
    }
}