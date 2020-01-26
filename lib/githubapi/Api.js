const axios = require('axios');
const {BASE_URL} = require('./constants')

module.exports = class {
    constructor() {}

    async findUsers(q) {
        try {
            const {data} = await axios.get(`${BASE_URL}/search/users?q="${encodeURI(q)}"`)
    
            return data;
        } catch(e) {
            console.log('err', e);
        }
    }
};