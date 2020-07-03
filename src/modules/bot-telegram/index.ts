import TelegramBot from 'node-telegram-bot-api'

import { getRandomYES } from '../../api/tenor'
import {
  TypeTelegramBotToken,
  TypeTelegramChatID,
} from '../../interfaces/bot-telegram'

class BotTelegram {
  token: TypeTelegramBotToken
  chatList: TypeTelegramChatID[]
  bot: TelegramBot

  constructor(token: TypeTelegramBotToken, chatList: TypeTelegramChatID[]) {
    this.token = token
    this.chatList = chatList

    console.log('Connect Bot')
    this.bot = new TelegramBot(token, { polling: true })
  }

  public async notifyYesQuestion(questionData: string): Promise<void> {
    const gifURL = await getRandomYES()
    await Promise.all(
      this.chatList.map(async chatID =>
        this.bot.sendDocument(chatID, gifURL, { caption: questionData }),
      ),
    )
  }
}

export default BotTelegram
