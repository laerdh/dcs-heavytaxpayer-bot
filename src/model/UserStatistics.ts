import { FlightData } from "./FlightData"

export interface UserStatistics {
    flightData: [FlightData]
    totalKills?: number
    totalDeaths?: number
    totalTax?: number
}