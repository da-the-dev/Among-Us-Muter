import { Client, Intents } from 'discord.js'
import * as dotenv from 'dotenv'
import commands from './core/modules/commandLoader'
import { install } from 'source-map-support'
import voiceStateUpdate from './core/modules/voiceStateUpdate'
import guildCreate from './core/modules/guildCreate'
install()
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('guildCreate', async guild => { guildCreate(guild) })
client.on('voiceStateUpdate', (oldState, newState) => voiceStateUpdate(oldState, newState))

client.on('interactionCreate', async i => {
    if (!i.isCommand()) return
    for (const c of commands) {
        try {
            if (c.name === i.commandName) { c.exec(i, client) }
        } catch (err) {
            console.log('handled err: ', err)
        }
    }
})

client.login(process.argv.slice(2)[0] === '--prod' ? process.env.TOKEN! : process.env.BETATOKEN!)
