const { AboutRow, About } = require("../embeds/embeds.json");

module.exports = {
  name: 'sobre',
  description: 'Informações sobre o bot!',
  async execute(interaction, bot) {
    interaction.reply({ embeds: [About], ephemeral: true, components: [AboutRow] });
  },
};