const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const Keyv = require('keyv')
const prefix = "!"

var client = new Discord.Client()
client.login(process.env.BETAKEY)

client.once('ready', () => {
    console.log("Im the Impostor!")
})

client.on('message', async msg => {
    if(!msg.author.bot && msg.content[0] == "!") {
        var args = msg.content.slice(1).split(" ")

        if(args[0] == "amgMute") {
            var keyv = new Keyv(process.env.REDISCLOUD_URL)
            var db = await keyv.get(msg.guild.id)

            if(!db) {
                msg.reply("couldn't find any data related to this server. Try `.register`")
                return
            }
            var roleId = db['muteRoleId']
            if(!roleId) {
                msg.reply('no mute role specified. Try `.addMuteRole @role` first')
                return
            }
            var voiceChannelId = db['voiceChannel']
            if(!voiceChannelId) {
                msg.reply('no Among Us voicechannel specified. Try `.addAmongUsChannel <channelid> first`')
                return
            }

            if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR")) || msg.member.roles.cache.find(role => role.id == roleId)) {
                /**@type {Discord.VoiceChannel} */
                var voiceChannel = await client.channels.fetch(voiceChannelId)
                if(!db.isMuted) {
                    voiceChannel.members.forEach(async m => {
                        await m.voice.setMute(true)
                        await m.voice.setDeaf(true)
                    })
                    msg.reply('channel muted! SHHHHHHHHH!')
                        .then(msg => {
                            msg.delete({ timeout: 3000 })
                        })
                } else {
                    voiceChannel.members.forEach(async m => {
                        await m.voice.setDeaf(false)
                        await m.voice.setMute(false)
                    })
                    msg.reply('channel un-muted! Speak!')
                        .then(msg => {
                            msg.delete({ timeout: 3000 })
                        })

                }
                db.isMuted = !db.isMuted
                await keyv.set(msg.guild.id, db)
                await msg.delete()
                return
            }
        }
        if(args[0] == "help") {
            var help = new Discord.MessageEmbed()
                .setTitle('Help menu')
                .setDescription('All AUM commands for admins and others')
                .addField("**!register**", "If AUM has never been used on this server, just type `!register` in any text chat. This command can only be run by users who have Administrator permission.")
                .addField('**!addMuteRole**', "To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type `.addMuteRole @roleName` in any text chat (Example: !addMuteRole @Among Us). This command can only be run by users who have Administrator permission.")
                .addField("**!addAmongUsChannel**", "To specify with voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type `!addAmoungUsChannel <channelid>` in any textchat (Example: !addAmongUsChannel 123456789123456789). This command can only be run by users who have Administrator permission.")
                .addField("**!amgMute**", "Once you have executed all previous commands, you can use `!amgMute`. To mute previously specified voicechannel, type `!amgMute`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type `!amgMute` again. Channel will be un-muted shortly.")
                .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
                .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://google.com) to help this project grow!")
                .setColor('#b50005')
                .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
            msg.channel.send(help)
        }
        if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR"))) {
            if(args[0] === "register") {
                const keyv = new Keyv(process.env.REDISCLOUD_URL)
                await keyv.set(msg.guild.id, { "isMuted": false })
                msg.reply('registered this server successfuly!')
                keyv.off('quit', (ev) => {
                    console.log(ev)
                })
            }

            if(args[0] === "addMuteRole") {
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
                    msg.reply("couldn't get any info about this server. Please try `.register`")
                }
            }

            if(args[0] === "addAmongUsChannel") {
                if(!args[1]) {
                    msg.reply("no voicechannel id specified")
                    return
                }
                if(Number.isInteger(Number(args[1]))) {
                    var channel = msg.guild.channels.cache.find(channel => channel.id == args[1])
                    var keyv = new Keyv(process.env.REDISCLOUD_URL)

                    var db = await keyv.get(msg.guild.id)
                    db.voiceChannel = args[1]
                    await keyv.set(msg.guild.id, db)
                    msg.reply(`successfuly added Among Us channel with name \`${channel.name}\`!`)
                }
            }
        } else {
            msg.reply("only server administrators have access to that command")
        }
        if(msg.content == ".checkdb" && msg.author.id == "315339158912761856") {
            const keyv = new Keyv(process.env.REDISCLOUD_URL)
            keyv.on('error', err => {
                console.log(err)
            })
            await keyv.set("1", "2")
            var data = await keyv.get("1")
            console.log(data)
        }
    }

    if(msg.content == ".wipedb" && msg.author.id == "315339158912761856") {
        console.log("wiping db...")
        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        await keyv.clear()
        console.log(await keyv.get(msg.guild.id))
    }
})