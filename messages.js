const Discord = require('discord.js')

module.exports = {
    /**@param client {Discord.Client} */
    "help": client => {
        return new Discord.MessageEmbed()
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
    },
    /**@param client {Discord.Client} */
    "setup": client => {
        return new Discord.MessageEmbed()
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
    }
}