const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const asyncRedis = require('async-redis');
const prefix = "$"

var client = new Discord.Client()

var commandNames = fs.readdirSync(__dirname + '/commands')
client.commands = new Array()
client.prefix = prefix
commandNames.forEach(c => {
    client.commands.push({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
    console.log({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
})

client.login(process.env.KEY)
client.once('ready', () => {
    console.log("Im the Impostor!")
    console.log(`Detecting my instance on ${client.guilds.cache.size} servers`)
    client.guilds.cache.forEach(i => {
        console.log(`Server "${i.name}"`)
    })
})

client.on('guildCreate', async guild => {
    client.commands.find(a => a.name == "_guildcreate").foo(guild, client)
})
client.on('guildDelete', async guild => {
    client.commands.find(a => a.name == "_guilddelete").foo(guild)
})
client.on('voiceStateUpdate', async (voiceState1, voiceState2) => {
    client.commands.find(a => a.name == "_voicestateupdate").foo(voiceState1, voiceState2)
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
            // Set up lobby for rooms
            if(!guild.channels.cache.find(c => c.type == 'category' && c.name == 'Among Us rooms'))
                guild.channels.create('Among Us rooms', { type: 'category' })

            // Create muter role
            guild.roles.create({
                data: {
                    name: 'AUM Muter Role',
                    color: '#b50005',
                },
                reason: "Required to properly use Among Us Muter bot"
            })
        }

        if(msg.content == '.sendDbInfo') {
            const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            console.log(JSON.parse(await db.get(msg.guild.id)))
            db.quit()
        }

        if(msg.content == '.sendServerList') {
            const db = asyncRedis.createClient(process.env.REDISCLOUD_URL)
            console.log((await db.get('serverList')).split(','))
            db.quit()
        }

        if(msg.content == '.simGuildJoin') {
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)

            if(!await redis.get(msg.guild.id)) {
                await redis.set(msg.guild.id, JSON.stringify({ "isMuted": false }))
                console.log('fresh server')
            } else {
                console.log('old server')
            }

            /**@type {Array<string>} */
            var serverList = (await redis.get('serverList'))
            if(!serverList)
                serverList = []
            else
                serverList = serverList.split(',')

            if(!serverList.includes(msg.guild.ownerID))
                serverList.push(msg.guild.ownerID)

            await redis.set('serverList', serverList.toString())

            /**@type {Discord.TextChannel} */
            var channel = msg.guild.channels.cache.find(c => c.type == "text" && (c.name == "general" || c.name == "main"))
            if(!channel) {
                channel = msg.guild.channels.cache.find(c => c.type == "text" && c.permissionsFor(msg.guild.id).has('SEND_MESSAGES'))
            }

            const guide = new Discord.MessageEmbed()
                .setTitle('Thanks for adding Among Us Muter to your server!')
                .setDescription(`Here's a step-by-step guide "How to set up Among Us Muter On Your Server"`)
                .addField(`**Step 1: \`${prefix}addMuteRole\`**`, `To let other users use AUM, you need to create a role that would let certain users use the bot. Once created, type \`${prefix}addMuteRole @roleName\` in any text chat (Example: \`${prefix}addMuteRole @Among Us\`). Now you can give this role to users you trust to let mute people so that they can use \`$amg\`. This command can only be run by users who have Administrator permission.`)
                .addField(`**Step 2: \`${prefix}addAmongUsChannel\`**`, `To specify which voicechannel to mute, use this command. Create the voicechat, right click and press 'Copy' to copy this voicechats's ID. Once done, type \`${prefix}addAmoungUsChannel <channelid>\` in any textchat (Example: \`${prefix}addAmongUsChannel 123456789123456789)\`. This command can only be run by users who have Administrator permission.`)
                .addField(`**Step 3: \`${prefix}amg\`**`, `Once you have executed all previous commands, you can use \`${prefix}amg\`. To mute previously specified voicechannel, type \`${prefix}amg\`. You need to have Administrator permission or have mute role. To un-mute previously specified voicechannel, simply type \`${prefix}amg\` again. Channel will be un-muted shortly.`)
                .setColor('#b50005')
                .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())

            channel.send(guide)

            redis.quit()
        }

        if(msg.content == '.simGuildLeave') {
            const redis = asyncRedis.createClient(process.env.REDISCLOUD_URL)

            // Delete server data
            if(await redis.get(msg.guild.id)) {
                redis.del(msg.guild.id)
                console.log('deleted server info')
            }

            /**@type {Array<string>} */
            var serverList = (await redis.get('serverList')).split(',')

            console.log(serverList)
            if(serverList.includes(msg.guild.ownerID))
                serverList.splice(serverList.indexOf(msg.guild.id), 1)
            console.log(serverList)

            await redis.set('serverList', serverList.toString())

            redis.quit()
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
            var user = client.users.cache.find(u => u.id == o)
            if(user) { user.send(update) }
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