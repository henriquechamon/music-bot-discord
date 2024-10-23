const {GuildMember, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'volume',
  description: 'Mude o volume!',
  options: [
    {
      name: 'volume',
      type: ApplicationCommandOptionType.Integer,
      description: 'Número abaixo de 200.',
      required: true,
    },
  ],
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'Você não ta no canal de voz!',
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
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | Nenhuma música tocando!',
      });

    var volume = interaction.options.getInteger('volume');
    volume = Math.max(0, volume);
    volume = Math.min(200, volume);
    const success = queue.setVolume(volume);

    return void interaction.followUp({
      content: success ? `🔊 | Volume agora é  ${volume}!` : '❌ | Erro!',
    });
  },
};
