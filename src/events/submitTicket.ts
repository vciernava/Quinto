import {CategoryChannel, CategoryChannelChildManager, ChannelType, Guild, GuildMember, ModalSubmitInteraction} from 'discord.js';
import Bot from '../handlers/botHandler';
import dotenv from 'dotenv';

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: ModalSubmitInteraction) => {
        if(interaction.isModalSubmit && interaction.customId === 'SubmitTicket') {
            const guild: Guild = interaction.client.guilds.resolve(interaction.guildId);

            const ticketCategory = guild.channels.resolve(config.TICKETS_ID) as CategoryChannel;
            const ticketCategoryChild = ticketCategory.children;

            const interactionFields = interaction.fields;

            const ticketChannel = ticketCategoryChild.create({ 
                name: '⚫・testTicket',
                type: ChannelType.GuildText,
                topic: interactionFields.getTextInputValue('ticketSubjectInput')
            });

            await interaction.reply({embeds: [await Bot.createEmbed('Support Request System', `Your request has been successfully submited!\nYou can check your request status at <#${(await ticketChannel).id}>`, 0x14e069)], ephemeral: true});
            await (await ticketChannel).send({embeds: [await Bot.createEmbedAuthor(interactionFields.getTextInputValue('ticketSubjectInput'), interactionFields.getTextInputValue('ticketDescriptionInput'), 0x14e069, interaction.member as GuildMember)]});
        }
    }
}