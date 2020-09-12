import { Telegraf, Context } from 'telegraf'

import { getRandomYES } from '../../api/tenor'
import {
  TypeTelegramBotToken,
  TypeTelegramChatID,
} from '../../interfaces/bot-telegram'

class BotTelegram {
  token: TypeTelegramBotToken
  chatList: TypeTelegramChatID[]
  bot: Telegraf<Context>

  constructor(token: TypeTelegramBotToken, chatList: TypeTelegramChatID[]) {
    this.token = token
    this.chatList = chatList

    console.log('Connect Bot')
    this.bot = new Telegraf(token)
  }

  public async notifyYesQuestion(questionData: string): Promise<void> {
    const gifURL = await getRandomYES()
    await Promise.all(
      this.chatList.map(async chatID =>
        this.bot.telegram.sendDocument(chatID, gifURL, {
          caption: questionData,
        }),
      ),
    )
  }
}

export default BotTelegram
