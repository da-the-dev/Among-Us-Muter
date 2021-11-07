import { CategoryChannel, MessageEmbed, VoiceChannel } from 'discord.js'
import BaseCommand from '../core/interfaces/BaseCommand'
import { amCategory, amGenerator } from '../core/modules/find'

export default {
    name: 'remove',
    description: 'Removes the bot from the server',
    exec: async i => {
        if (!i.memberPermissions?.has('ADMINISTRATOR')) {
            i.reply({
                content: 'You are not an admin, thus you can\'t remove me.',
                ephemeral: true
            })
            return
        }
        const guild = i.guild
        await guild?.channels.fetch()
        let cat: CategoryChannel | null, gen: VoiceChannel | null
        guild ? cat = amCategory(guild) : cat = null
        guild ? gen = amGenerator(guild) : gen = null

        if (cat && cat.deletable) await cat.delete()
        if (gen && gen.deletable) await gen.delete()

        await i.reply({
            embeds: [
                new MessageEmbed({
                    title: 'Thank you for using Among Us Muter!',
                    description: 'I am deply saddned that you had to remove Among Us Muter, but I guess it had to go. If you ran into any issues when using this bot, please take a minute an let me know!\n`alpaca#9667`',
                    color: 3092790
                })
            ],
            ephemeral: true
        })
    }
} as BaseCommand
