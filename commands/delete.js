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
        var category = guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')
        if(category) {
            category.children.forEach(c => {
                c.delete()
            })
        }
        category.delete()

        // Delete muter role
        var role = guild.roles.cache.find(r => r.name == 'AUM Muter Role')
        if(role)
            role.delete()
    }