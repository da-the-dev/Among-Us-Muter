const Keyv = require('keyv')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR"))) {
            const keyv = new Keyv(process.env.REDISCLOUD_URL)
            await keyv.set(msg.guild.id, { "isMuted": false })
            msg.reply('registered this server successfuly!')
            keyv.off('quit', (ev) => {
                console.log(ev)
            })
        }
    }