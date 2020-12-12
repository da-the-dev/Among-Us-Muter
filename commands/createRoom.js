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
                .then(m => {
                    m.delete(5000)
                })
            return
        }

        args.shift()
        var roomName = args.join(' ')

        // Create the room and delete it if empty for 30 seconds
        msg.guild.channels.create(roomName, { type: 'voice', userLimit: 10, parent: category })
            .then(c => {
                setTimeout(chan => {
                    if(chan.members.size <= 0) {
                        chan.delete()
                        return
                    }
                }, 30000, c)
            })

        msg.reply(`room \`${roomName}\` has been created!`)
            .then(m => {
                m.delete({ timeout: 5000 })
            })
    }