import { InteractionResponseType } from "discord-interactions"
import { InteractionResponse } from "../model/InteractionResponse"
import { InteractionName } from "../enum/InteractionName"
import { DiscordRequest } from "../utils"
import UserStatisticsService from "./UserStatisticsService"

class InteractionService {
    private static _instance: InteractionService
    
    private constructor() {}

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public async handleInteraction(interactionName: string): Promise<InteractionResponse> {
        switch (interactionName) {
            case InteractionName.STATS:
                const resultText = await UserStatisticsService.Instance.getUserStatistics()

                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: resultText
                    }
                }
            default:
                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'Aner ikke hva du prøver på nå?'
                    }
                }
        }
    }

    public async createCommands(): Promise<void> {
        const appId = process.env.APP_ID
        const globalEndpoint = `applications/${appId}/commands`
    
        const commandBody = {
            name: InteractionName.STATS,
            description: 'Hent spillerstatistikk fra DCS',
            type: 1
        }
    
        try {
            const res = await DiscordRequest(globalEndpoint, {
                method: 'POST',
                body: commandBody
            })
            console.log(await res.json())
        } catch (error) {
            console.error('Error installing commands: ', error)
        }
    }
}

export default InteractionService