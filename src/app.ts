import 'dotenv/config'
import express from 'express'
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes
} from 'discord-interactions'
import { VerifyDiscordRequest, DiscordRequest } from './utils'
const app = express()
const PORT = process.env.PORT || 3000

console.log('PK: ', process.env.PUBLIC_KEY)
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

app.post('/interactions', async (req, res) => {
    console.log('INTERACTION REQUESTED')

    const { type, id, data } = req.body

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG })
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data

        if (name === 'test') {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Føh fahn detta er fett da!?'
                }
            })
        }
    }
})

const createCommand = async () => {
    const appId = process.env.APP_ID
    const globalEndpoint = `applications/${appId}/commands`

    const commandBody = {
        name: 'test',
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

app.listen(PORT, () => {
    console.log('Listening on ports: ', PORT)

    createCommand()
})