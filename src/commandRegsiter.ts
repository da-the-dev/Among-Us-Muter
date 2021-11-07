import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as dotenv from 'dotenv'
import commands from './core/modules/commandLoader'
dotenv.config()

const loaderCommands = commands.map(c =>
    new SlashCommandBuilder().setName(c.name).setDescription(c.description || 'No description')
)

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENTID!),
        //     { body: commands }
        // )
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID!, '620690898015223848'),
            { body: loaderCommands }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
