const { AboutRow, About } = require("../embeds/embeds2.json");

module.exports = {
  name: 'ping',
  description: 'Vê o ping de conexão do bot',
  async execute(interaction, bot) {
    interaction.reply({ embeds: [About], ephemeral: true, components: [AboutRow] });
  },
};