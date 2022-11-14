import {
    SlashCommandBuilder,
    CommandInteraction,
    Guild,
    PermissionFlagsBits,
    EmbedBuilder,
    ColorResolvable
} from "discord.js";
import dotenv from "dotenv";
import Bot from "../handlers/botHandler";
import Instance from "../handlers/appHandler";

dotenv.config();
const config = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("configure")
        .setDescription("Command for automatic configuration.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const instance = new Instance();
        const client = Bot.client;
        const guild: Guild = client.guilds.cache.get(interaction.guildId);

        const embed = async (title: string, message: string, color: ColorResolvable) => {
            return new EmbedBuilder()
                .setTitle(title)
                .setDescription(message)
                .setFooter({text: (await instance.getInstance()).footer})
                .setColor(color)
                .setTimestamp();
        }

        await guild.members.fetch().then(members => {
            members.forEach(async member => {
                if (member.pending === false && !member.user.bot) {
                    await member.roles.add(Array(config.DEFAULT_ROLES));
                    await interaction.editReply({embeds: [await embed("Configuring your server settings.", `${member.user.username}'s roles have been updated.`, 0xFFAE00)]});
                }
            })
        })

        await interaction.editReply({embeds: [await embed("Server is ready to use.", "The new configuration has been successfully applied. ", 0x3ea2e)]});
    }
}