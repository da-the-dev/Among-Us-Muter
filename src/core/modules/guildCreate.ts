import { CategoryChannel, Guild, MessageEmbed, VoiceChannel } from 'discord.js'
import sendMessage from './sendMessage'

const error = 'An error happened! Looks like Among Us Muter is missing some permissons! Please, re-add the bot and make sure that all of the boxes are ticked!'
export default async (guild: Guild) => {
    // Channel creation
    let cat: CategoryChannel
    let lbg: VoiceChannel

    try {
        cat = await guild.channels.create('Among Us Lobbies', {
            type: 'GUILD_CATEGORY',
            position: 100
        })
    } catch (err) {
        console.log('guildCreate error: couln\'t create a category')
        await sendMessage(guild, error)
        return
    }

    try {
        lbg = await guild.channels.create('Lobby generator', {
            type: 'GUILD_VOICE',
            parent: cat!
        })
        await lbg.setUserLimit(1, 'Restrict user access for better lobby managment')
    } catch (err) {
        console.log('guildCreate error: couln\'t create a generator')
        await sendMessage(guild, error)
        return
    }

    const welcome = new MessageEmbed({
        title: '**Thank you for adding Among Us Muter to your server!**',
        description: 'Now, setup:\n1. Make sure that a new category with a new VC has been created.\n2. To use the bot, join "Lobby generator" and after the bot creates a new room for you, type `/am` in any text chat. This will mute the lobby. Type it again to unmute.\n\nFor any more info type like contacts or the GitHub page, type `/info`. To see this message again, type `/setup`.',
        color: 3092790
    })
    await sendMessage(guild, welcome)

    // // Role creation (not needed)
    // await guild.roles.create({
    //     name: 'AMG Muted',
    //     permissions: new Permissions().remove('SPEAK')
    // })
}
