import { UserStatistics } from "./UserStatistics"

export interface User {
    _id: number
    username: string
    statistics: [UserStatistics]
}