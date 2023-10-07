import { UserStatistics } from "../model/UserStatistics"
import { UserStatisticsInput } from "../model/UserStatisticsInput"
import UserRepository from "../repository/UserRepository"

class UserStatisticsService {
    private static _instance: UserStatisticsService

    private constructor() {}

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public async getUserStatistics(): Promise<string> {        
        const result = await UserRepository.Instance.getUserStatistics()
        const resultText = result?.flatMap(user => {
            const result = user.statistics.at(user.statistics.length - 1)
            return `${user.username} - Antall kræsj: ${result?.crashes}, høyeste hastighet: ${result?.maxAirspeed} IAS, maks G: ${result?.maxGforce}. Skattebetalerne må punge ut $${result?.maintenanceCosts} i vedlikeholdskostnader på grunn av deg, ditt jævla fittetryne :(`
        }).join("\n\n")

        return resultText
    }

    public async updateUserStatistics(userStatistics: UserStatisticsInput) {
        const maxAirspeed = Math.max(...userStatistics.airspeeds)
        const maxGs = Math.max(...userStatistics.gforces)
        const maintenanceCosts = this.calculateMaintenanceCosts(userStatistics)

        const update = {
            date: new Date(),
            username: userStatistics.username,
            kills: userStatistics.kills,
            crashes: userStatistics.crashes,
            maxAirspeed: maxAirspeed,
            maxGforce: maxGs,
            maintenanceCosts: maintenanceCosts
        } as UserStatistics

        const result = await UserRepository.Instance.updateUserStatistics(update)
        return result
    }

    private calculateMaintenanceCosts(userStatistics: UserStatisticsInput): number {
        const maxAirspeed = Math.max(...userStatistics.airspeeds)
        const maxGs = Math.max(...userStatistics.gforces)
        const crashes = userStatistics.crashes

        let totalCosts = 0

        if (crashes > 0) {
            const price = 40000000
            totalCosts = price * crashes
        }
        
        if (maxGs > 9) {
            const numberOfMaxGs = userStatistics.gforces.filter(gForce => gForce > 9).length
            totalCosts += numberOfMaxGs * 1000000
        }

        return totalCosts
    }
}

export default UserStatisticsService