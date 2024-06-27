const axios = require("axios");

module.exports = async (bot) => {
  bot.command(["rank"], async (ctx) => {
    try {
      const requestURL = process.env.API_REQ+process.env.USERS+process.env.API_KEY;
      const response = await axios(requestURL);
      const data = response.data.result;
      data.sort((a, b) => {
        if (!a.rating) return 1;
        if (!b.rating) return -1;
        return b.rating - a.rating;
      });
      ctx.session.group_data = data;
    } catch (error) {
      try {
        await ctx.reply("Something went wrong when fetching data")
      } catch (error) {
        console.log("Something went wrong when replying to user");  
        console.log(error.message)
      }
      console.log("Something went wrong when fetching data");
      console.log(error);
    }

    await ctx.scene.enter("RANKING_SCENE");
  });
};