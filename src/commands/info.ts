import { MessageEmbed } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'info',
    description: 'Shows more info about the bot',
    exec: async i => {
        i.reply({
            embeds: [
                new MessageEmbed({
                    "title": "Among Us Muter info",
                    "description": "**· Creator**\n`alpaca#9667`\nMessage me if something goes wrong, I'll answer shortly. My timezone is GMT+3.\n\n[**· GitHub page**](https://github.com/da-the-dev/Among-Us-Muter)\nFeel free to open pull requests, open issues, etc. The project is licenced under GPLv3, so take that in consideration when using my code.\n\n**· \"I found a bug, how do I report it?\"**\nUse `/bug` command, I'll take care of the issue shortly. Please make sure to use English language in your requests. Bot will take and send me your tag, so I might text you back to get more info.\n",
                    "color": 3092790
                }).setImage('https://i.stack.imgur.com/Fzh0w.png')
            ],
            ephemeral: true
        })
    }
} as BaseCommand
