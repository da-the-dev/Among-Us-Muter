const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: $amg <name>
    */
    async (args, msg, client) => {
        /**@type {Discord.CategoryChannel} */
        var category = msg.guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')
        if(!category)
            msg.guild.channels.create('Among Us rooms', { type: 'category' })

        if(!args[1]) {
            msg.reply('no room name specified!')
            return
        }

        msg.guild.channels.create(args[1], { type: 'voice', userLimit: 10, parent: category })

        // Delete the channel if empty for 30 seconds
        var id = setInterval(async () => {
            category.children.forEach(async c => {
                if(c.type == 'voice' && c.members.size <= 0) {
                    await c.delete()
                    clearInterval(id)
                }
            })
        }, 30000)
    }