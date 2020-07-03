import processEnv from './processEnv'
import BotTelegram from './modules/bot-telegram'
import Codeforces from './modules/codeforces'

async function main() {
  const env = processEnv()

  const bot = new BotTelegram(env.TELEGRAM_BOT_TOKEN, env.CHAT_LIST)
  const codeforces = new Codeforces(bot)
  await codeforces.loadUsersData(env.CODEFORCES_HANDLES)
  codeforces.run()
}

main()
