import { MongoClient } from "mongodb"
import { User } from "../model/User"
import { UserStatistics } from "../model/UserStatistics"

class UserRepository {
    private static _instance: UserRepository
    private readonly _mongoClient: MongoClient
    private readonly _databaseName = "heavytaxpayer"

    private constructor() {
        this._mongoClient = new MongoClient(process.env.MONGODB || '')
    }

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public async getUserStatistics(): Promise<User[]> {
        try {
            await this._mongoClient.connect()
            const result = await this._mongoClient.db(this._databaseName).collection('users').find({}).toArray()
            
            return result.map(entry => {
                return {
                    username: entry.username,
                    statistics: entry.statistics,
                } as User
            })
        } catch (error) {
            console.error(error)
            return []
        } finally {
            await this._mongoClient.close()
        }
    }

    public async updateUserStatistics(userStatistics: UserStatistics) {
        try {
            await this._mongoClient.connect()

            const result = await this._mongoClient.db(this._databaseName).collection('users').updateOne(
                { username: userStatistics.username },
                {
                    $push: {
                        statistics: {
                            date: userStatistics.date,
                            kills: userStatistics.kills,
                            crashes: userStatistics.crashes,
                            maxAirspeed: userStatistics.maxAirspeed,
                            maxGforce: userStatistics.maxGforce,
                            maintenanceCosts: userStatistics.maintenanceCosts,
                        }
                    }
                },
                { upsert: true })

            return result
        } catch (error) {
            console.error(error)
            return null
        } finally {
            await this._mongoClient.close()
        }
    }
}

export default UserRepository