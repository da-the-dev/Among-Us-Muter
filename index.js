const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const Keyv = require('keyv')
const prefix = "."

var client = new Discord.Client()

var commandNames = fs.readdirSync(__dirname + '/commands')
client.commands = new Array()
commandNames.forEach(c =>
    client.commands.push({
        'name': c.slice(0, c.length - 3),
        'foo': require(__dirname + '/commands/' + c)
    })
)

client.login(process.env.BETAKEY)
client.once('ready', () => {
    console.log("Im the Impostor, but Beta!")
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
    if(!msg.author.bot && msg.content[0] == "." && msg.author.id == "315339158912761856") {
        const keyv = new Keyv(process.env.REDISCLOUD_URL)
        switch(args[0].slice(1)) {
            case "checkdb":
                keyv.on('error', err => {
                    console.log(err)
                })
                await keyv.set("1", "2")
                var data = await keyv.get("1")
                if(data)
                    console.log('[DB] Database working fine')
                else
                    console.log("[DB] Database doesn't respond")

                await keyv.delete("1")
                break

            case 'wipedb123321':
                console.log('[DB] Wiping database...')
                await keyv.clear()
                console.log('[DB] Database wiped')
                break

            case "resetServerList123321":
                console.log('[DB] Resetting server list...')
                await keyv.delete("serverList")
                console.log('[DB] Server list reset')
                break

            case "checkServerList":
                console.log('[DB] Checking server list...')
                var serverList = await keyv.get('serverList')
                if(serverList) {
                    console.log('[DB] Server list working fine')
                    console.log(serverList)
                } else
                    console.log("[DB] Couldn't recieve server list :(")
                break

            case "addServerId":
                var serverList = await keyv.get("serverList")
                serverList.push(msg.guild.id)
                await keyv.set("serverList", serverList)
                var serverList = await keyv.get("serverList")
                if(serverList) {
                    console.log('[DB] Server ID appended')
                    console.log(serverList)
                } else
                    console.log("[DB] Couldn't recieve server list :(")

            case "test":
                return
                break
        }
    }

    // Update and hotfix notifications
    if(msg.channel.type == "dm" && msg.author.id === "315339158912761856") {
        async () => {
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
        }
        return
    }

    // DM help
    if(msg.channel.type == "dm") {
        async () => {
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
        return
    }
})