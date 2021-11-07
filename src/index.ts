import { CategoryChannel, Client, Guild, Intents, Permissions, VoiceChannel, VoiceState } from 'discord.js'
import * as dotenv from 'dotenv'
import commands from './core/modules/commandLoader'
import { install } from 'source-map-support'
install()
dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})


client.on('guildCreate', async guild => {
    await testGuildCreate(guild)
})
client.on('voiceStateUpdate', async (oldState, newState) => {
    const { guild, member } = newState
    await guild.channels.fetch()
    const amCategory = guild.channels.cache.find(c => c.name.toLowerCase() === 'among us lobbies') as CategoryChannel
    const amGenerator = guild.channels.cache.find(c => c.name.toLowerCase() === 'lobby generator' && c.parentId === amCategory.id) as VoiceChannel

    // Voice state update (mute, unmute, etc)
    if (oldState.channelId === newState.channelId)
        return
    // New lobby request
    if (newState.channel?.parentId === amCategory.id && newState.channel.id === amGenerator.id) {
        guild.channels.create(member?.displayName || 'Unknown room', {
            parent: amCategory,
            type: 'GUILD_VOICE',
            position: 100,
            userLimit: 10,
            permissionOverwrites: [
                { id: member!.id, allow: 'CREATE_INSTANT_INVITE' },
                { id: guild!.id, deny: 'CREATE_INSTANT_INVITE' }
            ]
        }).then(vc => member?.voice.setChannel(vc))
    }
    // Lobby is empty
    if (oldState.channel?.parentId === amCategory.id &&
        (!newState.channel || newState.channel.parentId != amCategory.id) &&
        oldState.channel.members.size <= 0
    )
        oldState.channel.delete()
    // Reasign lobby master if they leave
    if (oldState.channel?.parentId === amCategory.id &&
        (!newState.channel || newState.channel.parentId != amCategory.id) &&
        oldState.channel.permissionsFor(oldState.member!, true).has('CREATE_INSTANT_INVITE') &&
        oldState.channel.members.size > 0
    ) {
        const vc = oldState.channel
        const newMaster = vc.members.random()
        const oldMaster = oldState.member
        await vc.permissionOverwrites.delete(oldMaster!)
        await vc.permissionOverwrites.create(newMaster!, { CREATE_INSTANT_INVITE: true })
    }

})

client.on('interactionCreate', async i => {
    if (!i.isCommand()) return

    for (const c of commands) {
        if (c.name === i.commandName) { c.exec(i, client) }
    }
})

// client.on('messageCreate', m => {
//     if (!m.author.bot) { m.reply('2') }
// })

client.login(process.env.TOKEN!)

async function testGuildCreate(guild: Guild) {
    // Channel creation
    const cat = await guild.channels.create('Among Us lobbies', {
        type: 'GUILD_CATEGORY',
        position: 100
    })
    const lbg = await guild.channels.create('Lobby generator', {
        type: 'GUILD_VOICE',
        parent: cat
    })
    await lbg.setUserLimit(1, 'Restrict user access for better lobby managment')

    // Role creation
    await guild.roles.create({
        name: 'AMG Muted',
        permissions: new Permissions().remove('SPEAK')
    })
}
