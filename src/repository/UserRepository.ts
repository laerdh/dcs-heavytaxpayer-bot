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

            const result = await this._mongoClient.db(this._databaseName)
                .collection('users')
                .find({})
                .sort({ totalTax: -1 })
                .toArray()
            
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

    public async updateUserStatistics(username: string, statistics: UserStatistics) {
        try {
            await this._mongoClient.connect()

            const flightData = statistics.flightData.at(0)

            const result = await this._mongoClient.db(this._databaseName)
                .collection('users')
                .updateOne(
                    { username: username },
                    {
                        $inc: {
                            "statistics.totalTax": flightData?.maintenanceCosts,
                            "statistics.totalKills": flightData?.kills,
                            "statistics.totalDeaths": flightData?.deaths,
                        },
                        $push: {
                            "statistics.flightData": {
                                date: flightData?.date,
                                kills: flightData?.kills,
                                deaths: flightData?.deaths,
                                maxAirspeed: flightData?.maxAirspeed,
                                maxGforce: flightData?.maxGforce,
                                maintenanceCosts: flightData?.maintenanceCosts,
                            }
                        }
                    },
                    { upsert: true }
                )

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