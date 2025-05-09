const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pricelist = require("../../pricelist.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('source')
		.setDescription('Command for sourcing payment request.')
		.addStringOption(option =>
			option.setName("material")
			.setDescription("Material")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("amount")
			.setDescription("Amount")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("sourcer")
			.setDescription("Sourcer")
			.setRequired(true)),

	async execute(interaction) {

		const sourcer = interaction.options.getString("sourcer");
		const material = interaction.options.getString("material");
		const amount = interaction.options.getInteger("amount");
		const materialInfo = pricelist.find(item => item.id === material);

		const sourceEmbed = new EmbedBuilder()
			.setColor("#7b11bd")
			.setTitle(`Sourcer: ${sourcer}`)
			.addFields({ name: "MATERIAL:", value: `${materialInfo.blockname} ${amount}x <:shulker:1365223044800446546>` }, { name: "SOURCER PAY:", value: "4050<:ruby:1365502815807602808>" }, { name: "OPPERATIONS PAY:", value: "1215<:ruby:1365502815807602808>" })
			.setThumbnail('https://api.mineatar.io/face/d340e8d6-8b59-4380-89c1-ce45f290d906?scale=1.png')
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.member.user.username}`, iconURL: interaction.member.user.avatarURL() });

		await interaction.reply({ embeds: [sourceEmbed] });
	},
};
