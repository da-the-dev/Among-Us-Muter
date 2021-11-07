import { Guild, Permissions } from 'discord.js'

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

    // // Role creation (not needed)
    // await guild.roles.create({
    //     name: 'AMG Muted',
    //     permissions: new Permissions().remove('SPEAK')
    // })
}
