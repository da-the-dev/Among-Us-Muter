import { Client, CommandInteraction } from 'discord.js'

export default interface BaseCommand {
    name: string
    description?: string
    exec: (i: CommandInteraction, client?: Client) => void | Promise<void>
}
