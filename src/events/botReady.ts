import {Client, Events, Routes} from "discord.js"
import {REST} from "@discordjs/rest";
import dotenv from "dotenv";
dotenv.config();
const config = process.env;
import Commands from "../handlers/commandHandler";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (bot: Client ) => {
        console.info("Logged in as %s", bot.user.tag);

        const rest = new REST({
            version: "10"
        }).setToken(config.TOKEN);

        try {
            await rest.put(Routes.applicationGuildCommands(bot.user.id, config.GUILD_ID), {
                body: Commands.commands
            });
            console.info("All commands have been registered (locally)");

            bot.user.setStatus("idle");
        } catch (error) {
            console.error(error);
        }
    }
}