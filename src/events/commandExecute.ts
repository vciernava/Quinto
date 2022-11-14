import {CommandInteraction} from "discord.js";
import Bot from "../handlers/botHandler";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: CommandInteraction) => {
        const command = Bot.client.commands.get(interaction.commandName);
        console.log(command.data);

        if (!interaction.isCommand() || !command) return;


        try {
            await interaction.deferReply({ephemeral: command.ephemeral})
            await command.execute(interaction, Bot.client);
        } catch (error) {
            if (error) console.error(error.message);
            await interaction.editReply({
                embeds: [
                    {
                        color: 0xe69737,
                        title: "Oh no...",
                        description: `there has been an error during processing the request.`,
                        timestamp: new Date().toISOString(),
                    },
                ]
            });

        }
    }
}
