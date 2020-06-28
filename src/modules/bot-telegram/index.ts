import TelegramBot from 'node-telegram-bot-api'

import GifGenerator from '../gif-generator'
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
    // this.bot = new TelegramBot(token, { polling: true })
  }

  public notifyYesQuestion(): void {
    const gifURL = GifGenerator.getRandom()
    console.log(gifURL)
    // this.chatList.forEach(chatID =>
    //   this.bot.sendDocument(chatID, gifURL, { caption: '' }),
    // )
  }
}

export default BotTelegram
