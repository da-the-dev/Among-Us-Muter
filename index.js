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
    // if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR"))) {
    if(!msg.author.bot && msg.content[0] == ".") {
        if(msg.content == ".amgMute" && (msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR")) || msg.member.roles.cache.find(role => role.name == "Among Us"))) {
            /**@type {Discord.VoiceChannel} */
            var voiceChannel = await client.channels.fetch("763085829559681025")
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

        if(msg.content === ".register") {
            const keyv = new Keyv(process.env.REDISCLOUD_URL)
            await keyv.set(msg.guild.id, {})
            console.log(await keyv.get(msg.guild.id))
            keyv.off('quit', (ev) => {
                console.log(ev)
            })
        }

        if(msg.content === ".addMuteRole") {
            var roleId = msg.mentions.roles.first()
            console.log(roleId)
            // if(roleId) {
            //     serverInfo['muteRoleId'] = msg.member.roles.first().id
            //     console.log(serverInfo)
            //     await keyv.set(msg.guild.id, serverInfo)
            // }
            // const keyv = new Keyv(process.env.REDISCLOUD_URL)
            // var serverInfo = await keyv.get(msg.guild.id)
            // console.log(serverInfo)
            //     if(serverInfo) {
            //         var roleId = msg.member.roles.first().id
            //         console.log(roleId)
            //         if(roleId) {
            //             serverInfo['muteRoleId'] = msg.member.roles.first().id
            //             console.log(serverInfo)
            //             await keyv.set(msg.guild.id, serverInfo)
            //         }
            //         else {
            //             msg.reply("couldn't find this role's ID")
            //             return
            //         }
            //     } else {
            //         msg.reply('register this server with `.register`')
            //     }
            //     return
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
    // }
})