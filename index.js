const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const pg = require('pg')
const db = new pg.Client()

var client = new Discord.Client()
client.login(process.env.KEY)

var isMuted = false
var channelId = "757681696849002567"
var adminRole = "722067589332729909"

client.once('ready', () => {
    console.log("Im the Impostor!")
})

client.on('message', async msg => {
    if(!msg.author.bot && msg.content[0] == ".") {
        if(msg.content == ".amgMute" && msg.member.roles.cache.has(adminRole)) {
            /**@type {Discord.VoiceChannel} */
            var voiceChannel = await client.channels.fetch(channelId)
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
        }
        if(msg.content == ".checkdb") {
            db.connect(process.env.DATABASE_URL, (err, client, done) => {
                db.query("CREATE TABLE IF NOT EXISTS tasks(task_id INT AUTO_INCREMENT PRIMARY KEY)")
                db.query('SELECT * FROM tasks', (err, result) => {
                    done();
                    if(err) return console.error(err);
                    console.log(result.rows)
                })
            })
        }
    }
})