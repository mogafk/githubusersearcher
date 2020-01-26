const axios = require('axios');
const {BASE_URL} = require('./constants')


/**
 * config.chat_id 
 * config.response - omit(chat_id)
 */

module.exports = class {
    constructor(config) {
        this.chat_id = config.chat_id;
        this.response = config;
    }

    async reply(text) {
        try {
            const {data} = await axios.post(`${BASE_URL}/sendMessage`, {
                chat_id: this.chat_id,
                text
            });

            return data;
        } catch(e) {
            console.log(`sendMessage(${this.chat_id}) failed`, e.message);
        }

    }
}