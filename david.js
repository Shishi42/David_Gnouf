const Discord = require("discord.js");
const cron = require("cron");

const bot = new Discord.Client();
const config = require("./config.json");

const fs = require("fs");
bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err)

  let jsfile = files.filter(f => f.split(".").pop() === "js")

  if(jsfile.length <= 0){
    return console.log("[LOGS] ne trouve pas de commandes!");
  }

  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`)
    bot.commands.set(pull.config.name, pull)
    pull.config.aliases.forEach(alias => {
      bot.aliases.set(alias, pull.config.name)
    })
  })

})

bot.on("ready", async () => {
  console.log(`Connecté en tant que ${bot.user.tag}!`);
  bot.channels.cache.get(config.chan_dev).send('David est connecté.\nIncroyable du cul !');

  bot.user.setPresence({status : 'dnd', activity: { name: 'Jean-Claude coder.', type: 'WATCHING' }});

})

bot.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return;

  let prefix = config.prefix
  let messageArray = message.content.split(" ")
  let cmd = messageArray[0]
  let args = messageArray.slice(1)

  let commandFile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
  if(commandFile) commandFile.run(bot, message, args)

})

let job = new cron.CronJob('00 00 18 * * *', () => {
  bot.channels.cache.get(config.chan_dev).send("<@&750339448398675988> ~~Va dessiner connard-man~~ Ferme ce jeu (ou lève toi) et va reviser");
  bot.channels.cache.get(config.chan_dev).send("<@&750339318270132274> ~~Va reviser ton jap et ton code connard-man~~ Ferme Twitter et va reviser");
});

job.start()


bot.login(config.token);