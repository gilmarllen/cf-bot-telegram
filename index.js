const axios = require('axios')
const TelegramBot = require( `node-telegram-bot-api` )

const CONFIG = require('./config.json')
const BOT_TOKEN = CONFIG.telegram.token

// Bot Telegram
// Chat ID: 225306807
const bot = new TelegramBot( BOT_TOKEN, { polling: true } )

const INTERVAL_TIME = 5000

let handleList = initHandleList(CONFIG.codeforces.handles)

let chatList = initchatList(CONFIG.telegram.chat_list)

function forceArray(data) {
    if (!Array.isArray(data) && (data != null || data != undefined)) {
        data = [data];
    } else if (data == null || data == undefined) {
        data = [];
    }
    return data;
}


function initHandleList(arr) {
    let rtn = {}
    forceArray(arr).forEach(h => {
        rtn[h] = {
            questions: []
        }
    });
    return rtn;
}

function initchatList(arr) {
    let rtn = {}
    forceArray(arr).forEach(h => {
        rtn[h] = true
    });
    return rtn;
}

const getUserStatus = (handle) => {
    try {
        return axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
    } catch (error) {
        console.error(error)
    }
}

bot.onText( /\/signin (.+)/, async ( msg, match ) => {
    const chatID = msg.chat.id
    const nickname = match[1]
    let msgContent = ''
    console.log(chatID + ' | ' + nickname)
    if(chatID && nickname && nickname.length){
        if(!handleList[nickname]){
            handleList[nickname] = {
                questions: [],
                listener: setInterval(main, INTERVAL_TIME, nickname)
            }
            msgContent = `Success!`
        } else {
            msgContent = 'CF User already registered!'
        }        
    } else {
        msgContent = `Please, send: "/signin your_CF_handle"`
    }

    bot.sendMessage(msg.chat.id, msgContent);
})


bot.onText( /\/notify/, async ( msg, match ) => {
    console.log(msg.chat.id)
    chatList[msg.chat.id] = true
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(msg.chat.id, `Notify on!`);
});


bot.onText( /\/start/, async ( msg, match ) => {
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(msg.chat.id, `Please, send: "/signin your_CF_handle"`);
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function notifyAll(nick, question){
    for(chatIt in chatList){
        await bot.sendMessage(chatIt,
            `OK!🎈\n\
            Who: ${nick}\n\
            Problem: ${question.name}\n\
            ${question.link ? `Link: ${question.link}\n` : ''}\
            Time: ${question.time} ms\n\
            Mem: ${question.mem} bytes\n\
            ${question.tags.map(t => '#'+t.replace(' ', '_')).join(' ')}`,{
                disable_web_page_preview: true
            }
        )
    }
}

function getLastItem(arr){
    return arr && arr.slice(-1)[0]
}

const main = async (handle) => {
    console.log(`#=>: ${handle}`)
    const userStat = getUserStatus(handle)
    .then(res => {
        if(res && res.data && res.data.status === 'OK' && res.data.result){
            const lastItem = getLastItem(handleList[handle].questions)
            const lastID = (lastItem && lastItem.id) || 0
            const newOK = res.data.result.filter(sub => sub.verdict == 'OK' && sub.id > lastID).map(subObj => {
                return {
                    id: subObj.id,
                    name: subObj.problem && subObj.problem.name,
                    link: subObj.problem && subObj.problem.contestId && subObj.problem.index
                        && `https://codeforces.com/contest/${subObj.problem.contestId}/problem/${subObj.problem.index}`,
                    tags: subObj.problem && subObj.problem.tags,
                    lang: subObj.programmingLanguage,
                    time: subObj.timeConsumedMillis,
                    mem: subObj.memoryConsumedBytes
                }
            }).reverse()

            console.log(newOK)
            const logTelegram = async () => {
                for(ele of newOK){
                    await notifyAll(handle, ele)
                }
            }
            if(handleList[handle].notify)
                logTelegram()

            if(newOK.length > 0)
                handleList[handle].notify = true

            handleList[handle].questions = [...handleList[handle].questions, ...newOK]
        }
    })
    .catch(error => {
        console.log(`::> ${error}`)
    })
}

for(handle in handleList) {
    handleList[handle].listener = setInterval(main, INTERVAL_TIME, handle);
}

// TODO 1 user request/s