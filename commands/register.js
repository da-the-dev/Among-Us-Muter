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
            redis.on('ready', () => {
                console.log('[DB] Connection established')
            })
            redis.on('end', () => {
                console.log('[DB] Connection closed')
            })

            await redis.set(msg.guild.id, JSON.stringify({ "isMuted": false }))
            console.log(JSON.parse(await redis.get(msg.guild.id)))
            msg.reply('registered this server successfuly!')

            // await redis.get('s')

            redis.quit()
        }
    }