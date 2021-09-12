import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({path: './config.env'});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN).catch((error) => console.log(error));

let inLive = false;

client.on("ready", () => {
    checkIfChmoussIsInLive();
})

async function checkIfChmoussIsInLive(){
    const response = await fetch(`https://api.twitch.tv/helix/streams/?user_login=chmouss`, {
        method: 'GET',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_ACCESS_TOKEN,
        }
    });

    const result = await response.json();

    if(!inLive && result.data.length > 0 && result.data[0].type == 'live'){
        const annoucementChannel = client.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID);
        annoucementChannel.send("Hey " + client.guilds.cache.toJSON()[0].roles.everyone.toString() + "!\n\n"
                            + "Chmouss is live on Twitch, now playing **" + result.data[0].game_name + "** !\n\n"
                            + "**" + result.data[0].title + "**"
                            + "Be sure to check it out :blue_heart: https://www.twitch.tv/chmouss");
        inLive = true;

    } else if (result.data.length == 0 && inLive) {
        inLive = false;
    }
    
    checkIfChmoussIsInLive();
}