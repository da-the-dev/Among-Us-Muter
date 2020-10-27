const Discord = require('discord.js')
const Keyv = require('keyv')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    async (args, msg, client) => {
        if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR"))) {
            if(!msg.mentions.roles.first()) {
                msg.reply('no role specified')
                return
            }
            var roleId = msg.mentions.roles.first().id
            const keyv = new Keyv(process.env.REDISCLOUD_URL)
            var serverInfo = await keyv.get(msg.guild.id)

            if(serverInfo) {
                serverInfo['muteRoleId'] = roleId
                await keyv.set(msg.guild.id, serverInfo)
                msg.reply('mute role added successfuly!')
            } else {
                msg.reply(`couldn't get any info about this server. Please try \`${prefix}register\``)
            }
        }
    }