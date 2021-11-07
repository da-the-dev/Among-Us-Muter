import { CategoryChannel, Guild, VoiceChannel } from "discord.js"

const amCategory = (guild: Guild) => { return guild.channels.cache.find(c => c.name == 'Among Us Lobbies') as CategoryChannel }
const amGenerator = (guild: Guild, category?: CategoryChannel) => { return guild.channels.cache.find(c => c.name == 'Lobby generator' && c.parentId === (category?.id || amCategory(guild).id)) as VoiceChannel }
const muteRoleId = (guild: Guild) => { return guild.roles.cache.find(r => r.name === 'AMG Muted')!.id }
export { amCategory, amGenerator, muteRoleId }