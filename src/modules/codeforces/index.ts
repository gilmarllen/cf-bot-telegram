import { Queue } from 'queue-typescript'
import prettyBytes from 'pretty-bytes'

import BotTelegram from '../bot-telegram'
import User from './user'
import { TypeCodeforcesUserHandle, IResult } from '../../interfaces/codeforces'
import { delay } from '../../libs/util'

const API_CODEFORCES_DELAY = 200

class Codeforces {
  users: Queue<User>
  bot: BotTelegram

  constructor(bot: BotTelegram) {
    this.bot = bot
  }

  public async loadUsersData(
    handlesList: TypeCodeforcesUserHandle[],
  ): Promise<void> {
    const usersList = handlesList.map(userID => new User(userID))
    await Promise.all(usersList.map(async user => user.init()))

    this.users = new Queue<User>(...usersList)
  }

  public async run(): Promise<void> {
    // eslint-disable-next-line
    while (true) {
      const user = this.users.dequeue()
      const newAcceptedQuestions = await user.updateAcceptedQuestions()
      await Promise.all(
        newAcceptedQuestions.map(async submission =>
          this.bot.notifyYesQuestion(
            this.submissionToString(user.id, submission),
          ),
        ),
      )

      this.users.enqueue(user)
      await delay(API_CODEFORCES_DELAY)
    }
  }

  submissionToString(handleUser: string, submission: IResult): string {
    const { name } = submission.problem
    const link = `https://codeforces.com/contest/${submission.problem.contestId}/problem/${submission.problem.index}`
    const time = submission.timeConsumedMillis
    const mem = submission.memoryConsumedBytes
      ? prettyBytes(submission.memoryConsumedBytes)
      : ''
    const tags = (submission.problem.tags || [])
      .map(tag => `#${tag.replace(' ', '_')}`)
      .join(' ')

    return `YES!🎈
          Who: ${handleUser}
          Problem: ${name}
          Link: ${link}
          Time: ${time} ms
          Mem: ${mem}
          ${tags}`
  }
}

export default Codeforces
