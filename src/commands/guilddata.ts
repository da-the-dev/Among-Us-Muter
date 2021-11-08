import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'guilddata',
    description: 'Show on how many guilds this bot exists',
    exec: async (i, client) => {
        await client?.guilds.fetch()
        await i.reply({
            content: `Detecting instance on ${client?.guilds.cache.size} guilds`,
            ephemeral: true
        })
    }
} as BaseCommand
