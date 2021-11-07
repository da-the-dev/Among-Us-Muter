import { MessageEmbed } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'
import commands from '../core/modules/commandLoader'

export default {
    name: 'help',
    exec: async (i) => {
        i.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#2F3136')
                    .setFields(commands.map(c => {
                        return {
                            name: `/${c.name}`,
                            value: c.description || 'No description for this command'
                        }
                    }))
            ],
            ephemeral: true
        })
    }
} as BaseCommand
