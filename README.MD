# Among Us Muter

### [TL:DR section](#tldr)

## What is it? 
This is a Discord bot that solves the voicechannel spam problem when playing Among Us with friends on a Discord server. Have someone who doesn't mute themselves when the game started? Someone forgets to unmute themselves? With **Among Us Muter** this is no longer an issue! It mutes and unmutes everybody in the lobby to stop players from accidentally spoiling their role. It's very simple doesn't require much setup. Just [add the bot](https://discord.com/api/oauth2/authorize?client_id=765647669632172043&permissions=297797712&scope=bot%20applications.commands) and you'll get all of the info you need. If not, type `/info` in any text chat.


## How to use it
1. Create a lobby by joining *"Lobby generator"* voicechannel in *"Among Us Lobbies"* category. You are now a **lobby host** and only you can use lobby host's commands (`/am`).
2. Once it's created, invite your friends to join.
3. To mute the lobby, type `/am`.
4. To unmute the lobby, type `/am`.
5. It's that simple!
6. If you're done playing, just leave the lobby, it'll delete itself automatically.


### Contributing
This project is open-source, so if you have any suggestions or bugs to report, feel free to open a new issue at GitHub. I'll try my best to respond ASAP. Also you can open pull requests if you want to propose changes. You can use my code if it complies with [GPLv3 license](LICENSE).
   

## TL:DR
### Usage
1. [Link to add](https://discord.com/api/oauth2/authorize?client_id=765647669632172043&permissions=297797712&scope=bot%20applications.commands).
2. Join "Lobby generator".
3. `/am` to mute, same to unmute.      
### Beware
* ***Do not*** completely disconnect from the lobby if it's muted, join another channel to become unmuted, then disconnect. *(Issue is WIP)*    
* The lobby host will be reasigned randomly if the original one leaves. *(Better solution is WIP)*     
* If you want to **remove the bot from your server**, as an admin type `/delete`, then kick the bot.


<!-- Join link (I'll update this tomorrow)
https://discord.com/api/oauth2/authorize?client_id=765647669632172043&permissions=2445279232&scope=bot%20applications.commands -->