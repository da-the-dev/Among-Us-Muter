const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Clean up the server if owner wants to remove the bot
    */
    async (args, msg, client) => {
        // Delete lobby for rooms
        /**@type {Discord.CategoryChannel} */
        var category = msg.guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')
        if(category) {
            category.children.forEach(c => {
                c.delete()
            })
        }
        category.delete()

        // Create unnecessary roles
        var muterRole = msg.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
        var unmutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')
        var mutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Muted')
        if(muterRole) muterRole.delete()
        if(mutedTagRole) mutedTagRole.delete()
        if(unmutedTagRole) unmutedTagRole.delete()
    }