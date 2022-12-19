import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const config = process.env;

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction: ButtonInteraction) => {
        const Modal = new ModalBuilder()
            .setCustomId('SubmitTicket')
            .setTitle('Support Request Submission');

        const subjectInput = new TextInputBuilder()
            .setCustomId('ticketSubjectInput')
            .setLabel('Ticket subject')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);;

        const descriptionInput = new TextInputBuilder()
			.setCustomId('ticketDescriptionInput')
			.setLabel('Describe your problem')
			.setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(subjectInput) as ActionRowBuilder<TextInputBuilder>;
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput) as ActionRowBuilder<TextInputBuilder>;

        Modal.addComponents(firstActionRow, secondActionRow);
    }
}