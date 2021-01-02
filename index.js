const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const prefix = "."

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

client.login(process.env.BETAKEY)
client.once('ready', () => {
    console.log("Im the Impostor, but BETA!")
    console.log(`Detecting my instance on ${client.guilds.cache.size} servers`)
    client.user.setActivity(`type ${prefix}setup`, { type: 'WATCHING' })

    // Double check to delete all old and empty rooms
    client.guilds.cache.forEach(g => {
        g.channels.cache.filter(c => c.type == "category" && c.name == "Among Us rooms").forEach(c => {
            c.guild.channels.cache.find(c => c.type == "category" && c.name == "Among Us rooms").children.forEach(c => {
                if(c.members.size <= 0 && Date.now() - c.createdTimestamp > 30000)
                    if(c) c.delete()
                        .catch(e => console.log(e))
            })
        })
    })
})
client.on('guildCreate', async guild => {
    client.commands.find(a => a.name == "_guildcreate").foo(guild, client)
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
        if(msg.content.startsWith(".test")) {
            const exists = (v) => {
                if(v)
                    return true
                else
                    return false
            }

            var muterRole = msg.guild.roles.cache.find(r => r.name == 'AUM Muter Role')
            var unmutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Unmuted')
            var mutedTagRole = msg.guild.roles.cache.find(r => r.name == 'TAG: Muted')

            console.log(exists(muterRole), exists(mutedTagRole), exists(unmutedTagRole))
        }
        if(msg.content.startsWith(".unmute")) {
            msg.mentions.members.first().voice.setMute(false)
        }
    }

    // Update and hotfix notifications
    if(msg.channel.type == "dm" && msg.author.id === process.env.MY_ID) {
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

        //!!!FIX!!! Cannot send messages to this user
        client.guilds.cache.forEach(g => {
            client.users.cache.forEach(u => {
                if(u.id == g.ownerID)
                    u.send(update)
            })
        })
    }

    // DM help
    if(msg.channel.type == "dm" && msg.author.id != process.env.MY_ID) {
        await msg.author.send("Hi! If you want to checkout how to set me up on your server, check out this [video](https://www.youtube.com/watch?v=y4IwTTkcpc8)")
        await msg.author.send("If you need help, here it is:")
        var help = new Discord.MessageEmbed()
            .setTitle('Help menu')
            .setDescription('All AUM commands for admins and others')
            .addField(`**\`${client.prefix}setup\`**`, `If you need to refer to a step-by-step guide on how to setup the bot on your server, use this command.`)
            .addField(`**\`${client.prefix}createRoom\`**`, `To create a room to play Among Us and use AUM, type \`${client.prefix}createRoom <name>\`, replacing \`<name>\` with your desired room name. The voicechannel with the same name will be created in "AMONG US ROOMS" shortly.`)
            .addField(`**\`${client.prefix}amg\`**`, `Now, to mute the room, type \`${client.prefix}amg\` in any text channel. To un-mute the room, type \`${client.prefix}amg\` again. The lobby will be un-muted.`)
            // .addField(`**${client.prefix}fix**`, `If user left Among Us channel when it was muted, type \`${client.prefix}fix @member\` in any text chat (Example: \`${client.prefix}fix @daym bro\`). This will give them un-mute them.`)
            .addField(`**\`${client.prefix}delete\`**`, `If you want to remove AUM from your server, type this in any text channel to let it delete all util roles and categories. After that you can safely kick AUM out.`)
            .addField("**GitHub**", "This bot was written by hand using Node.js and discord.js! Want to see how it works? Checkout my github repo [here](https://github.com/da-the-dev/Among-Us-Muter)")
            .addField('**Patreon**', "Love this bot? Consider [donating a few dollans](https://www.patreon.com/da_dev) to help this project grow!")
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        await msg.author.send(help)
    }
})