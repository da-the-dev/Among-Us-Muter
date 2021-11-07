import { MessageEmbed } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'
import guildCreate from '../core/modules/guildCreate'

export default {
    name: 'test',
    description: 'test',
    exec: async i => {
        guildCreate(i.guild!)
    }
} as BaseCommand
