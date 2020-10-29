const networkService = require('./network.service')

exports.createDevice = async (req, res) => {
    try {
        await networkService.createDevice(req, res)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            resStatus: false,
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
            resStatus: false,
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
            resStatus: false,
            data: []
        });
    }
}