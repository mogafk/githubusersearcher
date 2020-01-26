const express = require('express')
const basicAuth = require('express-basic-auth')
const db = require('./dbconnection');
const {LongPolling} = require('./lib/telegram');
const {Api} = require('./lib/githubapi');
const app = express()
const githubApi = new Api();
const longPolling = new LongPolling({
    chunk: 15,
});

async function validate(message) {
    return !(/\s+/).test(message.text);
}

longPolling.subscribe(function(chats) {
    console.log('chats', chats);
    chats.forEach(async chat => {
        console.log('message: ', chat.response)
        const isValid = await validate(chat.response.message);
        if (!isValid) {
            chat.reply('В качестве сообщения должно быть одно слово-логин вашего аккаунта github');
        } else {
            const {total_count, items} = await githubApi.findUsers(chat.response.message.text)
            const user = items.find(item => item.login.toLowerCase() === chat.response.message.text.toLowerCase());
            if (total_count === 0 || !user) {
                chat.reply('Пользователей с таким логином не найдено');
                return;
            }

            try {
                await db.Users.create({
                    github_avatar_url: user.avatar_url,
                    github_login: user.login,
                    github_url: user.html_url,
                    github_user_id: user.id,
                    telegram_chat_id: chat.response.message.chat.id,
                    telegram_user_name: chat.response.message.from.first_name,
                    telegram_user_id: chat.response.message.from.id,
                });

                chat.reply("Пользватель успешно найден и сохранен");
            } catch(e) {
                chat.reply("Ошибка сохранения");
            }
        }
    })
});

longPolling.loop();

const onlyAuth = basicAuth({
    users: { 'admin': process.env.MAIN_ADMIN_PASS },
    unauthorizedResponse: () => {
        return 'authorization failed';
    },
    challenge: true

});
app.get('/dump', onlyAuth, async (req, res) => {
    const users = await db.Users.findAll();
    console.log('/dump', users);

    res.status(200).send(JSON.stringify(users, null, 2));
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))

