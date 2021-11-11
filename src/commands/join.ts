import { Collection, VoiceChannel } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'
import { amCategory } from '../core/modules/find'

export default {
    name: 'join',
    description: 'Join a random lobby',
    exec: async i => {
        const guild = i.guild
        const member = await guild?.members.fetch({ user: i.member.user.id })
        if (!member?.voice.channel) {
            await i.reply({
                content: 'You must be joined to any voicechannel before being moved to any lobby!',
                ephemeral: true
            })
            return
        }
        const category = amCategory(guild!)
        if (!category) return
        const lobby = (category.children.filter(c => c.isVoice() && c.name !== 'Lobby generator') as Collection<string, VoiceChannel>).random()
        if (lobby) {
            await member?.voice.setChannel(lobby)
                .catch(e => e)
            i.reply({ content: 'Lobby found! Moving...', ephemeral: true })
        } else {
            i.reply({ content: 'Couldn\'t find a lobby!', ephemeral: true })
        }
    }
} as BaseCommand
