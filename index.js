const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Erro com a fila: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Erro na conexão: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Comecei a tocar: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Música **${track.title}** na fila!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | Fui desconectado maunualmente durante o baile!');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Tô sozinho aqui.. Vou sair!');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Acabou a fila!');
});

client.once('ready', async () => {
  console.log('Foi Tô ligado e pronto pra tocar!');
   console.log(`\n[CLIENT READY] Source Aligg - ${client.user.tag} está ligado com sucesso!\nDetalhes: ${client.guilds.cache.size} servidores!\n`);
 
  client.user.setActivity(`to ligado`);
});

client.on('ready', function() {
 
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === '!configurar') {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('Estou atualizado, e configurado para esse servidor! Eu já posso iniciar meus show´s! Mas antes, verifique se há alguma atualização em nosso site sempre que atualizar! 🎶😊');
      })
      .catch(err => {
        message.reply('Ah, algo deu errado.');
        console.error(err);
      });
  }
  
	  if (message.content === '!config') {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('Estou atualizado, e configurado para esse servidor! Eu já posso iniciar meus show´s! Mas antes, verifique se há alguma atualização em nosso site sempre que atualizar! 🎶😊');
      })
      .catch(err => {
        message.reply('Ah, algo deu errado.');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'ERRO AO EXECUTAR.',
    });
  }
});


client.login(config.token);
