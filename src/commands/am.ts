import BaseCommand from '../core/interfaces/BaseCommand'
import { amCategory } from '../core/modules/find'

export default {
    name: 'am',
    description: 'Mute or unmute a lobby',
    exec: async i => {
        const guild = i.guild!
        const member = guild.members.cache.find(m => m.id === i.member.user.id)
        const vc = member?.voice.channel
        // If not connected to a lobby or not a host, ignore
        if (!vc || vc.parentId != amCategory(guild).id || !vc.permissionsFor(member).has('CREATE_INSTANT_INVITE')) {
            await i.reply({ content: 'You are not in a Among Us lobby or not a lobby host! Create a lobby to use this command!', ephemeral: true })
            return
        }

        if (!member.voice.mute) {
            await i.reply({
                content: 'Game started! Mutinng lobby...',
                ephemeral: true
            })
            await Promise.all(
                vc?.members.map(m => {
                    return m.voice.setMute(true)
                })!
            )
        } else {
            await i.reply({
                content: 'Vote started! Unmuting lobby...',
                ephemeral: true
            })
            await Promise.all(
                vc?.members.map(m => {
                    return m.voice.setMute(false)
                })!
            )
        }
    }
} as BaseCommand
