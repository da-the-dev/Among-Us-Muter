import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as dotenv from 'dotenv'; dotenv.config()

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('guildcreate').setDescription('Just a test')
]

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
            { body: commands }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
