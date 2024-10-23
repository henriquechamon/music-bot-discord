const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {QueueRepeatMode} = require('discord-player');

module.exports = {
  name: 'loop',
  description: 'Modo Loop',
  options: [
    {
      name: 'mode',
      type: ApplicationCommandOptionType.Integer,
      description: 'Loop type',
      required: true,
      choices: [
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ],
    },
  ],
  async execute(interaction, player) {
    try {
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
      if (!queue || !queue.playing) {
        return void interaction.followUp({content: '❌ | Nenhuma música está tocando!'});
      }

      const loopMode = interaction.options.getInteger('mode');
      const success = queue.setRepeatMode(loopMode);
      const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

      return void interaction.followUp({
        content: success ? `${mode} | Modo Loop ativado!` : '❌ | Não conseguir ativar loop!',
      });
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'Ops! Um grande erro foi encontrado... Contate meu dono Aligg#0002: ' + error.message,
      });
    }
  },
};
