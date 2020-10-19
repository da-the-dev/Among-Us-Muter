const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const Keyv = require('keyv')
const prefix = "$"

var client = new Discord.Client()
client.login(process.env.KEY)

client.once('ready', () => {
    console.log("Im the Impostor")
})

client.on('message', async msg => {
    if(!msg.author.bot && msg.content[0] == prefix) {
        var args = msg.content.slice(1).split(" ")

        if(args[0] == "amg") {
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
                        m.voice.setMute(true)
                    })
                    msg.reply('channel muted! SHHHHHHHHH!')
                        .then(msg => {
                            msg.delete({ timeout: 3000 })
                        })
                } else {
                    voiceChannel.members.forEach(async m => {
                        m.voice.setDeaf(false)
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

        if(args[0] == "fix") {
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

            if(msg.member.roles.cache.find(role => role.permissions.has("ADMINISTRATOR")) || msg.member.roles.cache.find(role => role.id == roleId)) {
                var mentioned = msg.mentions.members.first()
                if(mentioned) {
                    mentioned.voice.setMute(false)
                    msg.reply(`fixed <@${mentioned.user.id}>. Please, don't break the bot`)
                } else {
                    msg.reply("either no user mentioned, or not a user was specified")
                }
            }
        }

        if(args[0] == "help") {
            var help = new Discord.MessageEmbed()
                .setTitle('Help menu')
                .setDescription('All AUM commands for admins and others')
                .addField(`**${prefix}register**`, `If AUM has never been used on this server, just type \`${prefix}register\` in any text chat. This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}addMuteRole**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}addAmongUsChannel**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
                .addField(`**${prefix}amg**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
                .addField(`**${prefix}fix**`, `If user left Among Us channel when it was muted, type \`${prefix}fix @member\` in any text chat (Example: \`${prefix}fix @daym bro\`). This will give them back their microphone.`)
                .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
                .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://www.patreon.com/da_dev) to help this project grow!")
                .setColor('#b50005')
                .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
            msg.channel.send(help)
            return
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
                    msg.reply(`couldn't get any info about this server. Please try \`${prefix}register\``)
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
        return
    }

    if(msg.content == ".resetServerList" && msg.author.id == "315339158912761856") {
        console.log('resetting server list...')
        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        await keyv.delete("serverList")
        console.log(await keyv.get('serverList'))
        return
    }

    if(msg.content == ".checkServerList" && msg.author.id == "315339158912761856") {
        console.log('checking server list...')
        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        console.log(await keyv.get('serverList'))
        return
    }

    if(msg.content == ".addServerId" && msg.author.id == "315339158912761856") {
        console.log('addingServerId...')
        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        var serverList = await keyv.get("serverList")
        serverList.push(msg.guild.id)
        await keyv.set("serverList", serverList)
        console.log(await keyv.get("serverList"))
        return
    }

    if(msg.content == ".test" && msg.author.id === "315339158912761856") {
        var message = new Discord.MessageEmbed()
            .setTitle('test')
            .setFooter('[google](https://google.com)')
        msg.channel.send(message)
        return
    }

    // Update and hotfix notifications
    if(msg.channel.type == "dm" && msg.author.id === "315339158912761856") {
        var content = msg.content.split(" ")
        var type = content.shift()
        var content = content.join(' ')

        var update = new Discord.MessageEmbed()
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
            .setDescription("Be ***absolutely sure*** to notify your server members about this!!!")

        if(type == "update")
            update.setTitle("A new update has been released!")
        else if(type == "hotfix")
            update.setTitle("Hotfix coming up!")
        else return

        update.addField("What's new:", content)

        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        /**@type {Array<string>} */
        var guilds = await keyv.get('serverList')
        guilds.forEach(async g => {
            var guild = await client.guilds.fetch(g)
            console.log(guild.owner.user.username)
            guild.owner.user.send(update)
        })
        return
    }

    // DM help
    if(msg.channel.type == "dm") {
        await msg.author.send("Hi! If you want to checkout how to set me up on your server, check out this [video](https://www.youtube.com/watch?v=y4IwTTkcpc8)")
        await msg.author.send("If you need help, here it is:")
        var help = new Discord.MessageEmbed()
            .setTitle('Help menu')
            .setDescription('All AUM commands for admins and others')
            .addField(`**${prefix}register**`, `If AUM has never been used on this server, just type \`${prefix}register\` in any text chat. This command can only be run by users who have Administrator permission.`)
            .addField(`**${prefix}addMuteRole**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). This command can only be run by users who have Administrator permission.`)
            .addField(`**${prefix}addAmongUsChannel**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
            .addField(`**${prefix}amg**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
            .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
            .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://www.patreon.com/da_dev) to help this project grow!")
            .addField('**Still have troble setting everything up?**', 'Check out [this video](https://www.youtube.com/watch?v=y4IwTTkcpc8) with a setup-by-step visual guide on how to set Among Us Muter on your Discord server or hit me up directly on Discord, it\'s *daym bro#6625*!')
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        await msg.author.send(help)
        return
    }
})