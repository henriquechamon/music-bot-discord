const {GuildMember, ApplicationCommandOptionType } = require('discord.js');
const {QueryType} = require('discord-player');

module.exports = {
  name: 'play',
  description: 'Toca uma música ai DJ!',
  options: [
    {
      name: 'musica',
      type: ApplicationCommandOptionType.String,
      description: 'A Música que você quer tocar!',
      required: true,
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

      const musica = interaction.options.getString('musica');
      const searchResult = await player
        .search(musica, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({content: 'Sem resultados!'});

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
				quality: "highest",
				filter: "audioonly",
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
        metadata: interaction.channel,
      });
	  

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: 'Não foi possível entrar!',
        });
      }

      await interaction.followUp({
        content: `🔍 | to tentando tocar  ${searchResult.playlist ? 'playlist' : 'track'}...`,
      });
	  
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'Erro ao executar: ' + error.message,
      });
    }
  },
};
