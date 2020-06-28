export type TypeCodeforcesUserHandle = string

export interface IProblem {
  contestId: number
  index: string
  name: string
  type: string
  rating: number
  tags: string[]
  points?: number
}

export interface IMember {
  handle: string
}

export interface IAuthor {
  contestId: number
  members: IMember[]
  participantType: string
  ghost: boolean
  startTimeSeconds: number
  room?: number
}

export interface IResult {
  id: number
  contestId: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: IProblem
  author: IAuthor
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

export interface IUserStatus {
  status: string
  result: IResult[]
}
