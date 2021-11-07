import { MessageEmbed } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'setup',
    description: 'Shows a setup message',
    exec: async i => {
        i.reply({
            embeds: [
                new MessageEmbed({
                    "title": "Among Us Muter setup",
                    "description": "**Thank you for adding Among Us Muter to your server!**\nNow, setup:\n1. Make sure that a new category with a new VC has been created.\n2. To use the bot, join \"Lobby generator\" and after the bot creates a new room for you, type `/am` in any text chat. This will mute the lobby. Type it again to unmute.\n\nFor any more info type like contacts or the GitHub page, type `/info`.",
                    "color": 3092790
                })
            ],
            ephemeral: true
        })
    }
} as BaseCommand
