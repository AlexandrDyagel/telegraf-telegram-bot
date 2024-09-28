const { Telegraf, Markup, Scenes, session, Composer } = require("telegraf");
const { message } = require("telegraf/filters");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const arr = [];

const step1 = new Composer();
step1.on(message("text"), async (ctx) => {
  await ctx.reply("Введите ваше имя");
  await ctx.wizard.next();
});

const step2 = new Composer();
step2.on(message("text"), async (ctx) => {
  console.log("Ответ step2", ctx.message.text);
  arr.push(ctx.message.text);
  await ctx.reply("В каком городе вы живете?");
  await ctx.wizard.next();
});

const step3 = new Composer();
step3.on(message("text"), async (ctx) => {
  console.log("Ответ step3", ctx.message.text);
  if (ctx.message.text === "Глубокое") {
    await ctx.wizard.back();
    await ctx.reply(`Только не ${ctx.message.text}`);
    await ctx.reply(`Ответьте еще раз`);
  } else {
    await ctx.scene.leave();
  }
});
const menuScene = new Scenes.WizardScene("menuScene", step1, step2, step3);
const stage = new Scenes.Stage([menuScene]);

bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) => {
  ctx.scene.enter("menuScene");
});

bot.command("get", async (ctx) => {
  const { photos } = await ctx.telegram.getUserProfilePhotos(1229865421);
  const link = await ctx.telegram.getFile(
    "AgACAgIAAxUAAWb2zalZ5BYad-79sKiDSR3zk_1UAAIlyzEb3jZJSRy0nGhqlarVAQADAgADYwADNgQ",
  );
  console.log(photos);
  console.log(ctx.message.chat.id);
  console.log("Ссылка на файл: %s", link);
});

bot.launch();
