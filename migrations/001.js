var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlitedb');
db.run("CREATE TABLE users (github_avatar_url TEXT, github_login TEXT, github_url TEXT, github_user_id TEXT, telegram_chat_id TEXT, telegram_user_name TEXT, telegram_user_id TEXT)");