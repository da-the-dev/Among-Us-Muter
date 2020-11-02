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
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)

            await redis.set(msg.guild.id, JSON.stringify({ "isMuted": false }))
            msg.reply('registered this server successfuly!')

            /**@type {Array<string>} */
            var serverList = (await redis.get('serverList'))
            if(!serverList)
                serverList = []
            else
                serverList = serverList.split(',')

            if(!serverList.includes(msg.author.id))
                serverList.push(msg.author.id)

            await redis.set('serverList', serverList.toString())

            redis.quit()
        }
    }