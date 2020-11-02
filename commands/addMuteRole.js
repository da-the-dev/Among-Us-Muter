const Discord = require('discord.js')
const asyncRedis = require('async-redis');
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
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            redis.on('ready', () => {
                console.log('[DB] Connection established')
            })
            redis.on('end', () => {
                console.log('[DB] Connection closed')
            })
            var serverInfo = JSON.parse(await redis.get(msg.guild.id))

            if(serverInfo) {
                serverInfo['muteRoleId'] = roleId
                await redis.set(msg.guild.id, JSON.stringify(serverInfo))
                msg.reply('mute role added successfuly!')
            } else {
                msg.reply(`couldn't get any info about this server. Please try \`${prefix}register\``)
            }
            redis.quit()
        }
    }