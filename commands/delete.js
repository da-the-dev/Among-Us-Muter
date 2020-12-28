const exists = (v) => {
    if(v)
        return true
    else
        return false
}
const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Clean up the server if owner or admin wants to remove the bot
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(r => r.permissions.has('ADMINISTRATOR')) || msg.guild.ownerID == + msg.member.id) {
            // Delete lobby for rooms
            /**@type {Discord.CategoryChannel} */
            var category = msg.guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')
            if(category) {
                category.children.forEach(async c => {
                    await c.delete()
                })
                if(category) category.delete()
            }

            // Delete unnecessary roles
            var muterRole = msg.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')
            var mutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Muted')
            if(muterRole) await muterRole.delete()
            if(mutedTagRole) await mutedTagRole.delete()
            if(unmutedTagRole) await unmutedTagRole.delete()

            console.log(exists(muterRole), exists(mutedTagRole), exists(unmutedTagRole))

            msg.guild.leave()
        }
    }