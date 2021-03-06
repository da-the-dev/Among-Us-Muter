const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
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
    client.user.setActivity(`type ${prefix}setup`, { type: 'WATCHING' })

    // Double check and delete all old and empty rooms
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
    if(!msg.author.bot && msg.content == ".test" && msg.author.id == process.env.MY_ID) {
        msg.reply(client.ws.ping)
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
        await msg.author.send("Hi! If you want to checkout how to set me up on your server, check out this [video](https://youtu.be/ekl6CdgKmD4)")
        await msg.author.send("If you need help, here it is:")
        await msg.author.send(messages.help(client))
    }
})