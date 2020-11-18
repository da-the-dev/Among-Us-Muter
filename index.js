const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const asyncRedis = require('async-redis');
const prefix = "$"

var client = new Discord.Client()

var commandNames = fs.readdirSync(__dirname + '/commands')
client.commands = new Array()
client.prefix = prefix
commandNames.forEach(c =>
    client.commands.push({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
)

client.login(process.env.KEY)
client.once('ready', () => {
    console.log("Im the Impostor, but Beta!")
})

client.on('voiceStateUpdate', async (voiceState1, voiceState2) => {
    if(voiceState1.channelID == voiceState2.channelID)
        return

    const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
    var data = JSON.parse(await db.get(voiceState1.guild.id))

    if(!voiceState1.voiceChannel)
        db.quit()

    // If user leaves 
    if(voiceState1.channelID == data.voiceChannel)
        voiceState2.setMute(false)

    // If user joins
    if(voiceState2.channelID && voiceState2.channelID == data.voiceChannel)
        if(data.isMuted)
            voiceState2.setMute(true)
        else
            voiceState2.setMute(false)

    // If user leaves completely
    if(!voiceState2.channelID && voiceState1.channelID == data.voiceChannel)
        voiceState1.setMute(false)

    db.quit()
})

client.on('message', async msg => {
    // Bot commands
    if(!msg.author.bot && msg.content[0] == prefix) {
        var args = msg.content.slice(1).split(" ")

        client.commands.forEach(c => {
            if(c.name == args[0])
                c.foo(args, msg, client)
            return
        })
    }

    // Development tools
    if(!msg.author.bot && msg.content[0] == "." && msg.author.id == process.env.MY_ID) {
        if(msg.content == ".test") {
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            var serverList = (await redis.get('serverList')).split(',')
            if(serverList) {
                console.log(serverList)
            } else {
                console.log('No serverList')
            }
            redis.quit()
        }

        if(msg.content == '.clearRedisServerList321123') {
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            redis.on('ready', () => {
                console.log('[DB] Connection established')
            })
            redis.on('end', () => {
                console.log('[DB] Connection ended')
            })

            console.log(await redis.get('serverList'))
            await redis.del('serverList')
            console.log(await redis.get('serverList'))
            redis.quit()
            return
        }

        if(msg.content == ".wipedb321123") {
            const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            db.on('ready', () => {
                console.log('[DB] WIPING DATABASE')
            })
            await db.flushall()
            db.quit()
            return
        }
    }

    // Update and hotfix notifications
    if(msg.channel.type == "dm" && msg.author.id === process.env.MY_ID) {
        console.log('sending message')
        var content = msg.content.split(" ")
        var type = content.shift()
        var content = content.join(' ')

        console.log(type)

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

        const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)
        /**@type {Array<string>} */
        var owners = (await redis.get('serverList')).split(',')
        console.log(owners)
        owners.forEach(async o => {
            (await client.users.cache.find(u => u.id == o)).send(update)
        })
        redis.quit()
    }

    // DM help
    if(msg.channel.type == "dm" && msg.author.id != process.env.MY_ID) {
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
    }
})