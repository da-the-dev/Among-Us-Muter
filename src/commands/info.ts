import { MessageEmbed } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'info',
    description: 'Shows more info about the bot',
    exec: async (i, client) => {
        i.reply({
            embeds: [
                new MessageEmbed({
                    title: 'Among Us Muter info',
                    description: `**· Creator**\n\`alpaca#9667\`\nMessage me if something goes wrong, I'll answer shortly. My timezone is GMT+3.\n\n**· Currently used by:**\n***${client?.guilds.cache.size}*** servers.\n\n[**· GitHub page**](https://github.com/da-the-dev/Among-Us-Muter)\nFeel free to open pull requests, open issues, etc. The project is licenced under GPLv3, so take that in consideration when using my code.\n\n**· "I found a bug, how do I report it?"**\nUse \`/bug\` command, I'll take care of the issue shortly. Please make sure to use English language in your requests. Bot will take and send me your tag, so I might text you back to get more info.\n\n**· Remove the bot**\nIf you want to remove the bot, before kicking it out, as an admin type \`/remove\` to delete everything that Among Us Muter have created upon joining you server. If you have a spare minute, please text me the reason why you decided to remove Among Us Muter.`,
                    color: 3092790
                })
                // .setImage('https://i.stack.imgur.com/Fzh0w.png')
            ],
            ephemeral: true
        })
    }
} as BaseCommand
