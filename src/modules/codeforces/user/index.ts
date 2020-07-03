import codeforcesAPI from '../../../api/codeforces'
import {
  TypeCodeforcesUserHandle,
  IUserStatus,
  IResult,
} from '../../../interfaces/codeforces'

type OptIUserStatus = IUserStatus | undefined

class User {
  id: TypeCodeforcesUserHandle
  acceptedQuestions: Set<number>
  constructor(id: TypeCodeforcesUserHandle) {
    this.id = id
    this.acceptedQuestions = new Set()
  }

  public async init(): Promise<void> {
    const status = await this.getUserStatus()
    if (status) {
      this.addAcceptedQuestion(
        status.result
          .filter(submission => submission.verdict === 'OK') // TODO: Reuse
          .map(submission => submission.id),
      )
    }
  }

  public addAcceptedQuestion(questionID: number | number[]): void {
    if (typeof questionID === 'number') this.acceptedQuestions.add(questionID)
    else questionID.forEach(id => this.acceptedQuestions.add(id))
  }

  public async getUserStatus(): Promise<OptIUserStatus> {
    try {
      const response = await codeforcesAPI.get(`user.status?handle=${this.id}`)
      if (response && response.data.status === 'OK') return response.data
    } catch (error) {
      console.error(error)
    }

    return undefined
  }

  public async updateAcceptedQuestions(): Promise<IResult[]> {
    const status = await this.getUserStatus()
    if (status) {
      const newAcceptedQuestions = status.result
        .filter(submission => submission.verdict === 'OK')
        .filter(submission => !this.acceptedQuestions.has(submission.id))

      this.addAcceptedQuestion(
        newAcceptedQuestions.map(submission => submission.id),
      )

      return newAcceptedQuestions
    }

    return []
  }
}

export default User
