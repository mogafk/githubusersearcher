const fieldOrder = ['github_avatar_url', 'github_login', 'github_url', 'github_user_id', 'telegram_chat_id', 'telegram_user_name', 'telegram_user_id'];

module.exports = class {
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT rowid AS id, ${fieldOrder.join(', ')} FROM users`, function(err, res) {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }

    create(fields) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`INSERT INTO users(${fieldOrder.join(', ')}) VALUES (${fieldOrder.map(() => '?').join(', ')})`);

            stmt.run(fieldOrder.map((fieldName) => fields[fieldName]));
            stmt.finalize((err, res) => {
                if (err) {
                    return resolve(err);
                }

                resolve(res);
            });
        })
    }
}