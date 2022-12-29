import {
    SlashCommandBuilder,
    CommandInteraction,
    Guild,
    PermissionFlagsBits,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import dotenv from 'dotenv';
import Bot from '../handlers/botHandler';
import _Instance from '../handlers/appHandler';
import lang from '../lang/cs.json';

dotenv.config();
const config = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setNameLocalizations({
            'cs': 'konfigurace'
        })
        .setDescription('Automatic server configuration.')
        .setDescriptionLocalizations({
            'cs': 'Automatická konfigurace serveru.'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        const Client = Bot.client;
        const Guild: Guild = interaction.guild;
        const defaultRoles = config.DEFAULT_ROLES.split(',');

        /* Checking and Updating User Roles to Default Values */
        try {
            defaultRoles.forEach(role => {
                if(!Guild.roles.cache.get(role)) throw Error;

                Guild.members.fetch().then(members => {
                    members.forEach(async member => {
                        if (member.pending === false && !member.user.bot && !member.roles.cache.has(role)) {
                            await member.roles.add(role);
                            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Configuring your server settings.'], `${member.user.username}${lang['\'s roles have been updated.']}`, 0x3399ff)]});
                        }
                    });
                });
            });
        } catch {
            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Configuring your server settings.'], lang['Oh no! Seems like one of the default roles does not exist.'], 0xdb6262)]});
        };

        /* Clearing Ticket Action Button Message !(if exists) */
        const TicketChannel : TextChannel = Client.channels.resolve(config.TICKETS_CREATION_ID) as TextChannel;

        if(TicketChannel) {
            TicketChannel.bulkDelete(1).catch(console.error);
        }

        /* Creating Ticket Action Button */
        const Row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
                Bot.createButton('CreateTicket', lang['Create Ticket'], ButtonStyle.Primary, '📩')
			);

        await TicketChannel.send({embeds: [
            await Bot.createEmbed(lang['Support System'], 'If you require support, please press the button below.\n\n**Be Aware!**\n*If you require support outside of active hours, chances are your request will not be answered!*\n\n**Active hours:** `13:00` - `18:30` (GMT+1)', 0x3399ff)
        ], components: [
            Row
        ]});
        
        /* Sending confirmation message when configuration is done */
        setTimeout(async () => {
            await interaction.editReply({embeds: [await Bot.createEmbed(lang['Server is ready to use.'], lang['The new configuration has been successfully applied.'], 0x14e069)]});
        }, 500);
    }
}