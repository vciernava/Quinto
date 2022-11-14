import Discord, { Client, GatewayIntentBits } from "discord.js";

export default class Bot {
    public static client : Client = new Discord.Client(
        {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers
            ]
        }
    );
}