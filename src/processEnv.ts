import dotenv from 'dotenv'
import {
  TypeTelegramBotToken,
  TypeTelegramChatID,
} from './interfaces/bot-telegram'
import { TypeCodeforcesUserHandle } from './interfaces/codeforces'

dotenv.config()

interface IProcessEnv {
  TELEGRAM_BOT_TOKEN: TypeTelegramBotToken
  CHAT_LIST: TypeTelegramChatID[]
  CODEFORCES_HANDLES: TypeCodeforcesUserHandle[]
}

export default function processEnv(): IProcessEnv {
  const { TELEGRAM_BOT_TOKEN, CHAT_LIST, CODEFORCES_HANDLES } = process.env

  if (TELEGRAM_BOT_TOKEN) {
    return {
      TELEGRAM_BOT_TOKEN,
      CHAT_LIST: CHAT_LIST ? CHAT_LIST.split(',') : [],
      CODEFORCES_HANDLES: CODEFORCES_HANDLES
        ? CODEFORCES_HANDLES.split(',')
        : [],
    }
  }

  throw new Error('Not provided TELEGRAM_BOT_TOKEN')
}
