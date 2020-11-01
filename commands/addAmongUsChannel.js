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
            if(!args[1]) {
                msg.reply("no voicechannel id specified")
                return
            }
            if(Number.isInteger(Number(args[1]))) {
                var channel = msg.guild.channels.cache.find(channel => channel.id == args[1])

                const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
                redis.on('ready', () => {
                    console.log('[DB] Connection established')
                })
                redis.on('end', () => {
                    console.log('[DB] Connection closed')
                })

                var db = JSON.parse(await redis.get(msg.guild.id))
                db.voiceChannel = args[1]

                await redis.set(msg.guild.id, JSON.stringify(db))
                msg.reply(`successfuly added Among Us channel with name \`${channel.name}\`!`)
                redis.quit()
            }
        }
    }
