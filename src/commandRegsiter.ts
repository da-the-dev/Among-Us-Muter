import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as dotenv from 'dotenv'
import commands from './core/modules/commandLoader'
dotenv.config()

const blacklist = ['test', 'guilddata', 'bug']

const loaderCommands = commands.map(c =>
    new SlashCommandBuilder().setName(c.name).setDescription(c.description || 'No description')
)

// console.log(loaderCommands.filter(c => !blacklist.includes(c.name)))

const rest = new REST({ version: '9' }).setToken(process.argv.slice(2)[0] === '--prod' ? process.env.TOKEN! : process.env.BETATOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')
        if (process.argv.slice(2).includes('--global')) {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENTID!),
                // { body: []}
                { body: loaderCommands.filter(c => !blacklist.includes(c.name)) }
            )
        } else {
            await rest.put(
                Routes.applicationGuildCommands(process.argv.slice(2).includes('--prod') ? process.env.CLIENTID! : process.env.BETACLIENTID!, '620690898015223848'),
                { body: loaderCommands }
            )
        }

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
