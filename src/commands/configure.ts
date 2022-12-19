import {
    SlashCommandBuilder,
    CommandInteraction,
    Guild,
    PermissionFlagsBits,
    EmbedBuilder,
    ColorResolvable,
    Channel,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import dotenv from "dotenv";
import Bot from "../handlers/botHandler";
import _Instance from "../handlers/appHandler";

dotenv.config();
const config = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("configure")
        .setDescription("Command for automatic configuration.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const Instance = new _Instance();
        const Client = Bot.client;
        const Guild: Guild = Client.guilds.resolve(interaction.guildId);

        const Embed = async (title: string, message: string, color: ColorResolvable) => {
            return new EmbedBuilder()
                .setTitle(title)
                .setDescription(message)
                .setFooter({text: (await Instance.getInstance()).footer})
                .setColor(color)
                .setTimestamp();
        }

        /* Checking and Updating User Roles to Default Values */
        await Guild.members.fetch().then(members => {
            members.forEach(async member => {
                if (member.pending === false && !member.user.bot && !config.DEFAULT_ROLES.split(",").every(role => member.roles.cache.has(role))) {
                    await member.roles.add(config.DEFAULT_ROLES.split(","));
                    await interaction.editReply({embeds: [await Embed("Configuring your server settings.", `${member.user.username}'s roles have been updated.`, 0x2d92ff)]});
                }
            });
        });

        /* Clearing Ticket Action Button Message !(if exists) */
        const TicketChannel : TextChannel = Client.channels.cache.get(config.TICKETS_GENERAL_ID) as TextChannel;

        if(TicketChannel) {
            TicketChannel.bulkDelete(1).catch(console.error);
        }

        /* Creating Ticket Action Button */
        const Row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('CreateTicket')
					.setLabel('Create Ticket')
					.setStyle(ButtonStyle.Success),
			);

        await TicketChannel.send({embeds: [
            await Embed("Support Ticket System", "If you require support, please press the button below.\n\n**Be Aware!**\n*If you require support outside of active hours, chances are your request will not be answered!*\n\n**Active hours:** `13:00` - `18:30` (GMT+1)", 0x14e069)
        ], components: [
            Row
        ]});
        
        /* Sending confirmation message when configuration is done */
        setTimeout(async () => {
            await interaction.editReply({embeds: [await Embed("Server is ready to use.", "The new configuration has been successfully applied. ", 0x14e069)]});
        }, 500);
    }
}