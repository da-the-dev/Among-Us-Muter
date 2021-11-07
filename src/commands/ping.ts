import BaseCommand from '../core/interfaces/BaseCommand'

export default {
    name: 'ping',
    description: 'Shows ping of the bot',
    exec: async (i, client) => {
        i.reply({
            content: `Ping: ${client?.ws.ping} ms`,
            ephemeral: true
        })
    }
} as BaseCommand
