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
                color: 0x74309d,
                author: {
                    name: (await instance.getInstance()).author,
                    icon_url: (await instance.getInstance()).authorIcon
                },
                title: "Hello this is Quinto Bot!",
                description: "Utility discord bot made for community and personal servers. \n\n*What can Quinto do?* \nAdvance server configuration, Event logs, Announcements, Ticket system, Server administration, Role selection, Minecraft to Discord integration (Plugin required) and more to come...",
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