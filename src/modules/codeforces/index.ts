import { Queue } from 'queue-typescript'
import axios, { AxiosInstance } from 'axios'

import BotTelegram from '../bot-telegram'
import {
  TypeCodeforcesUserHandle,
  IUserStatus,
} from '../../interfaces/codeforces'
import { delay } from '../../libs/util'

type OptIUserStatus = IUserStatus | undefined

const API_CODEFORCES_DELAY = 5000 + 20
const BASE_URL = 'https://codeforces.com/api'

class Codeforces {
  handlesList: Queue<TypeCodeforcesUserHandle>
  bot: BotTelegram
  api: AxiosInstance

  constructor(bot: BotTelegram, handlesList: TypeCodeforcesUserHandle[]) {
    this.handlesList = new Queue<TypeCodeforcesUserHandle>(...handlesList)
    this.bot = bot
    this.api = axios.create({
      baseURL: BASE_URL,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public run(): void {
    this.poolingLoop()
  }

  async poolingLoop(): Promise<void> {
    const handle = this.handlesList.dequeue()
    const userStatus = await this.getUserStatus(handle)

    // this.bot.notifyYesQuestion()

    this.handlesList.enqueue(handle)
    await delay(API_CODEFORCES_DELAY)
    this.poolingLoop()
  }

  async getUserStatus(
    handle: TypeCodeforcesUserHandle,
  ): Promise<OptIUserStatus> {
    try {
      const response = await this.api.get(`user.status?handle=${handle}`)
      if (response && response.data.status === 'OK') return response.data
    } catch (error) {
      console.error(error)
    }

    return undefined
  }
}

export default Codeforces
