const Discord = require('discord.js')
const messages = require('../messages')
module.exports =
    /**
     * @param {Discord.Guild} guild Server guild
    */
    // Register server and send setup instructions
    async (guild, client) => {
        // console.log('got added to a server')

        /**@type {Discord.TextChannel} */
        var channel = guild.channels.cache.find(c => c.type == "text" && (c.name == "general" || c.name == "main"))
        if(!channel) {
            /**@type {Discord.Collection} */
            var channels = guild.channels.cache.filter(c => c.type == "text" && c.permissionsFor(guild.id).has('SEND_MESSAGES'))

            channels.sort((c1, c2) => {
                if(c1.name > c2.name) return 1
                if(c1.name < c2.name) return -1
                return 0
            })
            channel = channels.first()
        }

        channel.send(messages.setup(client))

        // Set up lobby for rooms
        if(!guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms')) {
            guild.channels.create('Among Us rooms', { type: 'category' })
            // .then(category => {
            //     guild.channels.create('match-history', {
            //         type: 'text',
            //         parent: category,
            //         permissionOverwrites:
            //             [
            //                 {
            //                     'id': guild.id,
            //                     'deny': 'SEND_MESSAGES'
            //                 }
            //             ]
            //     })
            // })
        }

        // Create necessary roles
        guild.roles.create({
            data: {
                name: 'AUM Muter Role',
                hoisted: true,
                color: '#b50005',
            },
            reason: "Required to properly use Among Us Muter bot"
        })
        guild.roles.create({
            data: { name: 'TAG: Unmuted' },
            hoist: true,
            reason: "Required to properly use Among Us Muter bot"
        })
        guild.roles.create({
            data: { name: 'TAG: Muted' },
            hoist: true,
            reason: "Required to properly use Among Us Muter bot"
        })
    }