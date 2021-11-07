import { Guild, MessageEmbed } from 'discord.js'

export default async (guild: Guild) => {
    // Channel creation
    const cat = await guild.channels.create('Among Us Lobbies', {
        type: 'GUILD_CATEGORY',
        position: 100
    })
    const lbg = await guild.channels.create('Lobby generator', {
        type: 'GUILD_VOICE',
        parent: cat
    })
    await lbg.setUserLimit(1, 'Restrict user access for better lobby managment')

    const welcome = new MessageEmbed({
        title: '**Thank you for adding Among Us Muter to your server!**',
        description: 'Now, setup:\n1. Make sure that a new category with a new VC has been created.\n2. To use the bot, join "Lobby generator" and after the bot creates a new room for you, type `/am` in any text chat. This will mute the lobby. Type it again to unmute.\n\nFor any more info type like contacts or the GitHub page, type `/info`. To see this message again, type `/setup`.',
        color: 3092790
    })
    await guild.channels.fetch()
    const avalibleTextChannels = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT')
    const general = avalibleTextChannels.find(c => c.name === 'general' || c.name === 'main')
    if (general && general.isText()) general.send({ embeds: [welcome] })
    if (!general) {
        const tc = avalibleTextChannels.random()
        if (tc?.isText()) tc.send({ embeds: [welcome] })
    }

    // // Role creation (not needed)
    // await guild.roles.create({
    //     name: 'AMG Muted',
    //     permissions: new Permissions().remove('SPEAK')
    // })
}
