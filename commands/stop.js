const {GuildMember} = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Para as músicas!',
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
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | Nenhuma música está tocando!',
      });
    queue.destroy();
    return void interaction.followUp({content: '😒 | Ah! Que pena que a festa acabou.'});
  },
};
