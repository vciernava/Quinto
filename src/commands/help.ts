import {
    SlashCommandBuilder,
    CommandInteraction,
    EmbedBuilder,
    RestOrArray,
    APIEmbedField,
    SlashCommandNumberOption
} from "discord.js";
import Commands from "../handlers/commandHandler";
import Instance from "../handlers/appHandler";

const paginationOption: SlashCommandNumberOption = new SlashCommandNumberOption()
    .setName("page")
    .setDescription("Select page")
    .setRequired(false);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays all available commands.")
        .addNumberOption(paginationOption),
    ephemeral: true,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({ephemeral: true});

        const instance = new Instance();
        const commands = Commands.commands;
        const numberOfItems = commands.length;
        const showPerPage = 9;

        const countPages = Math.ceil((numberOfItems / showPerPage));
        let currentPage = 1;
        if (interaction.options.data.length != 0) {
            currentPage = Number(interaction.options.data.find(item => item.name === 'page').value);
            currentPage = currentPage == 0 ? 1 : currentPage;
        }
        const startFrom = (currentPage - 1) * showPerPage;
        const endAt = startFrom + showPerPage;
        const fields: RestOrArray<APIEmbedField> = [];

        if(countPages < currentPage) {
            const field: APIEmbedField = {inline:false, name: "404 Not found", value: "There are no more commands found..."};
            fields.push(field);
        }
        for (let i = startFrom; i < endAt && i < commands.length; i++) {
            const field: APIEmbedField = {inline: true, name: commands[i].name, value: commands[i].description};
            fields.push(field)
        }

        const embed = new EmbedBuilder()
            .setTitle("Need support? message me.")
            .setDescription("All available commands:")
            .addFields(fields)
            .setFooter({text: `Page ${currentPage}/${countPages} - ${(await instance.getInstance()).footer}`})
            .setColor(0xfc0362)
            .setTimestamp();
        await interaction.editReply({embeds: [embed]})
    }
}