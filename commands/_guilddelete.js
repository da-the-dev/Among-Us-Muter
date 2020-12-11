const Discord = require('discord.js')
const asyncRedis = require('async-redis');
module.exports =
    /**
     * @param {Discord.Guild} guild Server guild
    */
    // Delete now irrelevant data inside database and send goodbye's
    async guild => {
        console.log('got removed from a server')
        const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)

        // Delete server data
        if(await redis.get(guild.id))
            redis.del(guild.id)

        /**@type {Array<string>} */
        var serverList = (await redis.get('serverList')).split(',')

        if(serverList.includes(guild.ownerID))
            serverList.splice(serverList.indexOf(guild.id), 1)

        await redis.set('serverList', serverList.toString())

        redis.quit()
    }