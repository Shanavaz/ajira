const db = require('../db/connection')
const enums = require('../db/config')['enums']


// console.log(db.run('select * from network'))




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