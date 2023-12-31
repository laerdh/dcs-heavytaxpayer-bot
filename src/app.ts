import 'dotenv/config'
import express from 'express'
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes
} from 'discord-interactions'
import { VerifyDiscordRequest } from './Utils'
import InteractionService from './services/InteractionService'

const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

app.post('/interactions', async (req, res) => {
    const { type, id, data } = req.body

    if (type === InteractionType.PING) {
        return res.status(200).send({ type: InteractionResponseType.PONG })
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data
        const result = await InteractionService.Instance.handleInteraction(name)
        return res.send(result)
    }
})

app.post('users/:name/statistics', async (req, res) => {
    console.log('Statistics received')
    return res.status(201)
})

app.listen(PORT, () => {
    console.log('Listening on ports: ', PORT)
    InteractionService.Instance.createCommands()
})