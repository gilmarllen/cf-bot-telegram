import processEnv from './processEnv'
import BotTelegram from './modules/bot-telegram'
import Codeforces from './modules/codeforces'

const env = processEnv()

const bot = new BotTelegram(env.TELEGRAM_BOT_TOKEN, env.CHAT_LIST)
const codeforces = new Codeforces(bot, env.CODEFORCES_HANDLES)
codeforces.run()
