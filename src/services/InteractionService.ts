import { InteractionResponseType } from "discord-interactions"
import { InteractionResponse } from "../model/InteractionResponse"
import { InteractionName } from "../model/InteractionName"
import { DiscordRequest } from "../utils"

class InteractionService {
    private static _instance: InteractionService
    
    private constructor() {}

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    public async handleInteraction(interactionName: string): Promise<InteractionResponse> {
        switch (interactionName) {
            case InteractionName.TEST:
                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'Føh fahn detta er fett a?!'
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
            name: InteractionName.TEST,
            description: 'Command for testing',
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