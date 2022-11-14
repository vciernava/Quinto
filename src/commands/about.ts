import {SlashCommandBuilder, CommandInteraction} from "discord.js";
import Instance from "../handlers/appHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Displays basic information about bot."),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();

        await interaction.editReply({
            embeds: [{
                color: 0xfc0362,
                author: {
                    name: (await instance.getInstance()).author,
                    icon_url: (await instance.getInstance()).authorIcon
                },
                title: "Hello this is Goyasu!",
                description: "This is a discord bot I decided to create after a few failed discord bot realizations. This discord bot is coded in TypeScript, which I choose after those failed attempts in JavaScript.\n This discord bot is created for server administration via commands or dashboard online.",
                fields: [
                    {
                        name: "🏁 Version",
                        value: (await instance.getInstance()).version,
                        inline: true,
                    },
                    {
                        name: "📅 Published",
                        value: new Date(Number((await instance.getInstance()).gitCommit.committedOn) * 1000).toLocaleDateString(),
                        inline: true,
                    },
                    {
                        name: "⌛ Short Hash",
                        value: (await instance.getInstance()).gitCommit.shortHash,
                        inline: true,
                    },
                    {
                        name: "💬 Latest Message",
                        value: (await instance.getInstance()).gitCommit.subject,
                        inline: false,
                    },
                ],
                footer: {
                    text: (await instance.getInstance()).footer
                },
                timestamp: new Date().toISOString(),
            }]
        });
    }
}