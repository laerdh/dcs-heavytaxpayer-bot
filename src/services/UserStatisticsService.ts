import { FlightDataInput } from "../model/FlightDataInput"
import { UserStatistics } from "../model/UserStatistics"
import UserRepository from "../repository/UserRepository"

class UserStatisticsService {
    private static _instance: UserStatisticsService

    private constructor() {}

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public async getUserStatistics(): Promise<string> {    
        const res = await UserRepository.Instance.updateUserStatistics('RotorMcSkakk', {
            flightData: [{
                date: new Date(),
                kills: 0,
                deaths: 32,
                maxAirspeed: 2000,
                maxGforce: 18,
                maintenanceCosts: 99999
            }]
        })

        const result = await UserRepository.Instance.getUserStatistics()

        if (!result) {
            return 'No game data found.'
        }

        const title = `Top ${result.length} tax wasters\n\n`
        
        const content = result?.flatMap((user, index) => {
            const userStatistics = user.statistics
            const flightStatistics = userStatistics.flightData.at(userStatistics.flightData.length - 1)

            const totalKills = userStatistics?.totalKills ?? 0
            const totalDeaths = userStatistics?.totalDeaths ?? 0
            const totalTax = userStatistics?.totalTax ?? 0

            const kills = flightStatistics?.kills ?? 0
            const deaths = flightStatistics?.deaths ?? 0
            const maxAirspeed = flightStatistics?.maxAirspeed ?? 0
            const maxGforce = flightStatistics?.maxGforce ?? 0

            return `***${index+1}. ${user.username}***Kills: ${kills} (Total: ${totalKills})\nDeaths: ${deaths} (Total: ${totalDeaths})\nMax airspeed: ${maxAirspeed} IAS\nMax G: ${maxGforce}\nTotal tax: $${totalTax}`
        }).join("\n\n")

        return title + content
    }

    public async updateUserStatistics(flightData: FlightDataInput) {
        const maxAirspeed = Math.max(...flightData.airspeeds)
        const maxGs = Math.max(...flightData.gforces)
        const maintenanceCosts = this.calculateMaintenanceCosts(flightData)

        const update = {
            flightData: [{
                date: new Date(),
                kills: flightData.kills,
                deaths: flightData.deaths,
                maxAirspeed: maxAirspeed,
                maxGforce: maxGs,
                maintenanceCosts: maintenanceCosts
            }]
        } as UserStatistics

        const result = await UserRepository.Instance.updateUserStatistics(flightData.username, update)
        return result
    }

    private calculateMaintenanceCosts(flightData: FlightDataInput): number {
        const maxAirspeed = Math.max(...flightData.airspeeds)
        const maxGs = Math.max(...flightData.gforces)
        const deaths = flightData.deaths

        let totalCosts = 0

        if (deaths > 0) {
            const price = 40000000
            totalCosts = price * deaths
        }
        
        if (maxGs > 9) {
            const numberOfMaxGs = flightData.gforces.filter(gForce => gForce > 9).length
            totalCosts += numberOfMaxGs * 1000000
        }

        return totalCosts
    }
}

export default UserStatisticsService