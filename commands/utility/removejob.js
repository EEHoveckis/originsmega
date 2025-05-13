const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetchUUID = require("../../helperFunctions/fetchUUID.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("removejob")
		.setDescription("Remove payment.")
		.addStringOption(option =>
			option.setName("jobid")
			.setDescription("Id Of Job")
			.setRequired(true)),
	async execute(interaction, database) {
		const jobId = interaction.options.getString("jobid");

		const result = await database.collection("payments").updateMany({ "jobs.jobId": jobId }, { $pull: { jobs: { jobId: jobId } } }, { multi: true });
		if (result.modifiedCount > 0) {
			const successEmbed = new EmbedBuilder()
				.setColor("#7b11bd")
				.setTitle("Remove Job")
				.setDescription(`Removed ${result.modifiedCount} Jobs With ID \`${jobId}\``);

			await interaction.reply({ embeds: [successEmbed] });
		} else {
			const errorEmbed = new EmbedBuilder()
				.setColor("#c21717")
				.setDescription(`No Jobs With ID \`${jobId}\` Found!`);

			await interaction.reply({ embeds: [errorEmbed] });
		}
	},
};
