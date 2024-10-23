const {GuildMember, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'Remove um som da fila!',
  options: [
    {
      name: 'number',
      type: ApplicationCommandOptionType.Integer,
      description: 'A fila que você quer tirar',
      required: true,
    },
  ],
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'Você não está em um canal de voz!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'Você não está no mesmo canal de voz que eu!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | Nenhuma música está tocando!'});
    const number = interaction.options.getInteger('number') - 1;
    if (number > queue.tracks.length)
      return void interaction.followUp({content: '😢 | O Número da track é maior do que devia!'});
    const removedTrack = queue.remove(number);
    return void interaction.followUp({
      content: removedTrack ? `✅ | Removido **${removedTrack}**!` : '❌ | Algo deu errado!',
    });
  },
};
