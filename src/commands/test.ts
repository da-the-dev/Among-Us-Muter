import BaseCommand from '../core/interfaces/BaseCommand'
import guildCreate from '../core/modules/guildCreate'

export default {
    name: 'test',
    description: 'test',
    exec: async i => {
        if (i.member.user.id !== '315339158912761856') return
        await i.reply('done')
        guildCreate(i.guild!)
        await i.deleteReply()
    }
} as BaseCommand
