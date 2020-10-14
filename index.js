const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const Keyv = require('keyv')

// const redis = require('redis');
// const db = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });

var client = new Discord.Client()
client.login(process.env.KEY)

client.once('ready', () => {
    console.log("Im the Impostor!")
})

client.on('message', async msg => {
    if(!msg.author.bot && msg.content[0] == ".") {
        if(msg.content == ".amgMute" && msg.member.roles.cache.has(adminRole)) {
            /**@type {Discord.VoiceChannel} */
            var voiceChannel = await client.channels.fetch(channelId)
            if(!isMuted) {
                voiceChannel.members.forEach(async m => {
                    await m.voice.setMute(true)
                    await m.voice.setDeaf(true)
                })
            } else {
                voiceChannel.members.forEach(async m => {
                    await m.voice.setDeaf(false)
                    await m.voice.setMute(false)
                })
            }
            isMuted = !isMuted
            await msg.delete()
            return
        }

        if(msg.content === "getRolesInfo") {
            msg.member.roles.cache
            return
        }

        if(msg.content == ".checkdb") {
            const keyv = new Keyv(process.env.REDISCLOUD_URL)
            keyv.on('error', err => {
                console.log(err)
            })
            await keyv.set("1", "2")
            var data = await keyv.get("1")
            console.log(data)
        }
    }
})