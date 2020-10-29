var sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(function () {
    db.run("CREATE TABLE network (type TEXT, name TEXT NOT NULL PRIMARY KEY, strength INT DEFAULT 5)");
})

module.exports = db