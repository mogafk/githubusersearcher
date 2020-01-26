const axios = require('axios');
const {BASE_URL} = require('./constants')
const Chat = require('./Chat');

/**
 * config.chunk 
 */

module.exports = class {
    constructor(config) {
        this.chunk = config.chunk;
        this.handlers = [];
    }

    async loop() {
        let latestUpdateId = null;
        while(true) {
            const res = await this.getUpdates({
                limit: this.chunk,
                offset: latestUpdateId,
                timeout: 10,
            });
            latestUpdateId = Math.max(
                ...res.map(({update_id}) => update_id)
            ) + 1;


            this.handlers.forEach((cb) => {
                const chats = res.map(res => {
                    return new Chat({
                        chat_id: res.message.chat.id,
                        ...res
                    });

                })
                cb(chats);
            });
        }
    }

    subscribe(fn) {
        this.handlers.push(fn);
    }

    async getUpdates(params) {
        try {
            const {data} = await axios.post(`${BASE_URL}/getUpdates`, {
                ...params
            });

            return data.result;
        } catch(e) {
            console.log(`getUpdates failed`, e.message);
        }
    }
}