import { MessageEmbed, TextChannel } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'bug',
    description: 'Use this to report a bug',
    exec: async (i, client) => {
        (client?.guilds.cache.get('620690898015223848')?.channels.cache.get('907363448000757851') as TextChannel).send(i.options.getString('bug')!)
        i.reply({
            embeds: [
                new MessageEmbed({
                    title: 'Bug report has been submitted!',
                    description: `The contents of it are: \n\`\`\`${i.options.getString('bug')}\`\`\``,
                    color: 3092790
                })
            ],
            ephemeral: true
        })
    }
} as BaseCommand
