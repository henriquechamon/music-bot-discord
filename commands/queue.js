const {GuildMember} = require('discord.js');

module.exports = {

    name: 'queue',
    description: 'vê a fila!',

    async execute (interaction, player) {

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
          var queue = player.getQueue(interaction.guildId);
          if (typeof(queue) != 'undefined') {
            trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
              return void interaction.reply({
                embeds: [
                  {
                    title: 'Agora estou tocando',
                    description: trimString(`A Playlist que toca é  🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! `, 4095),
                  }
                ]
              })
          } else {
            return void interaction.reply({
              content: 'Nada na fila!'
            })
          }
    }
}
