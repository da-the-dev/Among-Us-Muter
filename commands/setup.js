const Discord = require('discord.js')
module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
    */
    (args, msg, client) => {
        prefix = client.prefix
        const guide = new Discord.MessageEmbed()
            .setTitle('Thanks for adding Among Us Muter to your server!')
            .setDescription(`Here's a step-by-step guide "How to set up Among Us Muter On Your Server"`)
            .addField(`**Step 1: Look at your server's categories**`, `After you add you add AUM to your server make sure that there's a new category called "AMONG US ROOMS". This is where all of the voice channels for AUM are going to be created.`)
            .addField(`**Step 2: \`${client.prefix}createRoom\`**`, `To create a room to play Among Us and use AUM, type \`${client.prefix}createRoom <name>\`, replacing \`<name>\` with your desired room name. The voicechannel with the same name will be created in "AMONG US ROOMS" shortly.`)
            .addField(`**Step 3: Join the room**`, `Once you've joined the room, you will recieve 2 roles: 'AUM Muter Role' and 'TAG: Unmuted'. Don't worry about the second role, it is used by the bot. You just have to make sure you have these roles.`)
            .addField(`**Step 4: Bring your friends in the same voicechannel and when the game started type \`$amg\`**`, `Now, to mute the room, type \`${client.prefix}amg\` in any text channel. To un-mute the room, type \`${client.prefix}amg\` again. The lobby will be un-muted.`)
            .addField(`**Step 5: Play!**`, `Just and play enjoy Among Us!`)
            .addField(`**Step 6: When you're done**`, `Once you're done playing, just leave the voicechannel. It will delete itself after about a half a minute.`)
            .addField(`**Have questions?**`, `Type \`${client.prefix}help\` in any text chat to get a help message.`)
            .setColor('#b50005')
            .setFooter('Among Us Muter by da-the-dev', client.user.avatarURL())
        msg.channel.send(guide)
    }
