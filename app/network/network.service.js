const db = require('../db/connection')
const enums = require('../db/config')['enums']


exports.createDevice = async (req, res) => {
    try {
        let responseMsg = ''
        if (Object.keys(req.body).length === 0) {
            console.log('empty')
            responseMsg = 'Invalid Command.'
            res.status(400).json({
                msg: responseMsg
            });
            return
        }
        let type = enums.repeater
        if ((req.body.type).toUpperCase() === ('COMPUTER').toUpperCase()) {
            type = enums.computer
        } else if ((req.body.type).toUpperCase() === ('REPEATER').toUpperCase()) {
            type = enums.repeater
        } else {
            responseMsg = `type '${req.body.type}' is not supported`
            res.status(400).json({
                msg: responseMsg
            });
            return
        }
        let strength = 5
        if (req.body.strength > 0) {
            strength = req.body.strength
        }
        let networkArr = [type, req.body.name, strength]
        db.run(`INSERT into network (type, name, strength) values (?,?,?)`, networkArr, function (err) {
            if (err) {
                console.log(err);
                console.log(err.message);
                if (err.errno === 19 && (err.message).includes('UNIQUE constraint failed')) {
                    responseMsg = `Device ${req.body.name} already exists`
                }
                res.status(400).json({
                    msg: responseMsg
                });
                return
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            responseMsg = `Successfully added ${req.body.name}`
            res.status(200).json({
                msg: responseMsg
            });
        });
    } catch (err) {
        console.log(err)
        throw new Error(err);
    }
}

exports.getAllDevices = async (req, res) => {
    try {
        db.all(`select * from network`, function (err, result) {
            if (err) {
                return console.log(err.message);
            }
            console.log(result)
            res.status(200).json({
                data: result
            });
        });
    } catch (err) {
        console.log(err)
        throw new Error(err);
    }
}

exports.modifyStrength = async (req, res) => {
    try {

        db.all(`select name from network`, function (err, result) {
            if (err) {
                return console.log(err.message);
            }
            if (result.length > 0) {
                if (isNaN(req.body.value)) {
                    console.log('NAN')
                    res.status(400).json({
                        msg: 'value should be an integer'
                    });
                    return
                }
                let networkArr = [req.body.value, req.params.name]
                db.run(`UPDATE network set strength = ? where name = ?`, [networkArr], function (err) {
                    if (err) {
                        res.status(400).json({
                            msg: err.message
                        });
                        return
                    }
                    console.log(`A row has been updated with rowid`);
                    responseMsg = `Successfully defined strength`
                    res.status(200).json({
                        msg: responseMsg
                    });
                    return
                });
            } else {
                res.status(404).json({
                    msg: 'Device Not Found'
                });
                return
            }
        });


    } catch (err) {
        console.log(err)
        throw new Error(err);
    }
}

exports.createConnection = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0 || !(Object.keys(req.body)).includes('targets')) {
            console.log('empty')
            responseMsg = 'Invalid command syntax'
            res.status(400).json({
                msg: responseMsg
            });
            return
        }

        let sourceNameArr = [req.body.source]
        db.all(`select targets from network where name = ?`, sourceNameArr, function (err, targetsResult) {
            if (err) {
                return console.log(err.message);
            }
            if ((req.body.targets).includes(req.body.source)) {
                responseMsg = 'Cannot connect device to itself'
                res.status(400).json({
                    msg: responseMsg
                });
                return
            }
            console.log(targetsResult)
            let targetsArr = req.body.targets
            let targetArrStr = ''
            if (targetsResult.length === 0 || targetsResult[0].targets === null) {
                console.log('target result is null')
                targetArrStr = ''
            } else {
                console.log('target result is there')
                console.log(targetsResult)
                targetArrStr = targetsResult[0].targets
            }
            for (let i = 0; i < targetsArr.length; i++) {
                if (i === 0 && targetArrStr === '') {
                    targetArrStr += targetsArr[i]
                } else {
                    targetArrStr += ',' + targetsArr[i]
                }
            }
            let connectionArr = [targetArrStr, req.body.source]
            console.log(connectionArr)
            db.run(`UPDATE network set targets = ? where name = ?`, connectionArr, function (err) {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                        msg: 'error'
                    });
                    return
                }
                // console.log(this)
                console.log(`Updated the null target array`);
                responseMsg = `Successfully connected`
                res.status(200).json({
                    msg: responseMsg
                });
                return
            });



        });


    } catch (err) {
        console.log(err)
        throw new Error(err);
    }
}