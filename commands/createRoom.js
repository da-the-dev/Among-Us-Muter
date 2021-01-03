const Discord = require('discord.js')
const channelDeletionTimeout = 2000
// const channelDeletionTimeout = 99999
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
        console.log(category.children.forEach(c => console.log(c.name)))
        if(category.children.find(c => c.name == roomName)) {
            msg.reply('this lobby name already has been used. Try another.')
            return
        }

        args.shift()
        var roomName = args.join(' ')

        //!!!FIX!!! Unknown Channel error at delete
        // Create the room and delete it if empty for 30 seconds
        msg.guild.channels.create(roomName, { type: 'voice', userLimit: 10, parent: category })
            .then(c => {
                var interval = setInterval(chan => {
                    if(chan.members.size <= 0)
                        if(chan)
                            chan.delete()
                                .then(() => clearInterval(interval))
                                .catch(e => console.log(e))
                }, channelDeletionTimeout, c)
            })

        msg.reply(`room \`${roomName}\` has been created!`)
            .then(m => {
                m.delete({ timeout: 5000 })
            })

        // const channelCreated = new Discord.MessageEmbed()
        //     .setTitle(`A new room \`${roomName}\` has been created!`)
        //     .setDescription(`[Join here](${await msg.guild.channels.cache.find(c => c.name == roomName && c.type == 'text').createInvite({ maxUses: 1 }).url})`)
        //     .setColor('#b50005')
        //     .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        // // msg.guild.channels.cache.find(c => c.name == 'match-history' && c.type == 'text').send()
    }