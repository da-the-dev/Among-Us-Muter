import * as dotenv from 'dotenv'
import { Client, Intents } from 'discord.js'; dotenv.config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('guildCreate', async guild => {
    const category = await guild.channels.create('Among Us lobbies', {
        type: 'GUILD_CATEGORY',
        position: 100
    })
    const lgvc = await guild.channels.create('Lobby generator', {
        type: 'GUILD_VOICE',
        parent: category
    })
    await lgvc.setUserLimit(1, 'Restrict user access for better lobby managment')
})

client.on('interactionCreate', async i => {
    if (!i.isCommand()) return

    if (i.commandName === 'ping') {
        await i.reply('Pong!')
    }
})

client.login(process.env.TOKEN!)
