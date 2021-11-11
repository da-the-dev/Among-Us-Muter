import { Guild, MessageEmbed } from 'discord.js'

function err() {
    console.log('Couldn\'t send a message. Missing permissons.')
}

export default async (guild: Guild, message: MessageEmbed | string) => {
    await guild.channels.fetch()
    const avalibleTextChannels = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT')
    const general = avalibleTextChannels.find(c => c.name === 'general' || c.name === 'main')
    if (general && general.isText()) typeof message === 'string' ? await general.send({ content: message }).catch(e => err()) : await general.send({ embeds: [message] }).catch(e => err())
    if (!general) {
        const tc = avalibleTextChannels.first()
        if (tc?.isText()) typeof message === 'string' ? await tc.send({ content: message }).catch(e => err()) : await tc.send({ embeds: [message] }).catch(e => err())
    }
}
