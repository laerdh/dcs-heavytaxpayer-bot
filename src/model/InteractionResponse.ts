import { InteractionResponseType } from "discord-interactions";

export interface InteractionResponse {
    type: InteractionResponseType,
    data: any
}