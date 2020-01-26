var sqlite3 = require('sqlite3').verbose();
var UsersModel = require('./models/Users');
var db = new sqlite3.Database('./sqlitedb');

const Users = new UsersModel(db);

module.exports = {
    Users,
}