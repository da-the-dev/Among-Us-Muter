import { Client, Guild, Intents, Permissions } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('guildCreate', async guild => {
    await testGuildCreate(guild)
})

client.on('interactionCreate', async i => {
    if (!i.isCommand()) return

    if (i.commandName === 'ping') {
        await i.reply('Pong!')
    }
    if (i.commandName === 'guildcreate') {
        await testGuildCreate(i.guild!)
        await i.reply('Generated')
    }
})

// client.on('messageCreate', m => {
//     if (!m.author.bot) { m.reply('2') }
// })

client.login(process.env.TOKEN!)

async function testGuildCreate(guild: Guild) {
    // Channel creation
    const category = await guild.channels.create('Among Us lobbies', {
        type: 'GUILD_CATEGORY',
        position: 100
    })
    const lgvc = await guild.channels.create('Lobby generator', {
        type: 'GUILD_VOICE',
        parent: category
    })
    await lgvc.setUserLimit(1, 'Restrict user access for better lobby managment')

    // Role creation
    await guild.roles.create({
        name: 'AMG Muted',
        permissions: new Permissions().remove('SPEAK')
    })
}
