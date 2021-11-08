import { Guild, MessageEmbed } from 'discord.js'

export default async (guild: Guild, message: MessageEmbed | string) => {
    await guild.channels.fetch()
    const avalibleTextChannels = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT')
    const general = avalibleTextChannels.find(c => c.name === 'general' || c.name === 'main')
    if (general && general.isText()) typeof message === 'string' ? await general.send({ content: message }).catch(e => e) : await general.send({ embeds: [message] }).catch(e => e)
    if (!general) {
        const tc = avalibleTextChannels.random()
        if (tc?.isText()) typeof message === 'string' ? await tc.send({ content: message }).catch(e => e) : await tc.send({ embeds: [message] }).catch(e => e)
    }
}
