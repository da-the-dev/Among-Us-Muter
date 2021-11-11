import { CategoryChannel, Guild, VoiceChannel } from 'discord.js'

const amCategory = (guild: Guild): CategoryChannel | null => { return guild.channels.cache.find(c => c.name === 'Among Us Lobbies') as CategoryChannel || null }
const amGenerator = (guild: Guild, category?: CategoryChannel): VoiceChannel | null => {
    if (!category) {
        const cat = amCategory(guild)
        if (!cat) return null
        return guild.channels.cache.find(c => c.name === 'Lobby generator' && c.parentId === cat.id) as VoiceChannel || null
    } else { return guild.channels.cache.find(c => c.name === 'Lobby generator' && c.parentId === category.id) as VoiceChannel || null }
}
export { amCategory, amGenerator }
