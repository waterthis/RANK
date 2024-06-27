const { default: axios } = require("axios");

module.exports = (bot) => {
  bot.command(["user"], async (ctx) => {
    if (ctx.payload) {
      const waitMessage = await ctx.reply("Calculating User Rating. . . ");
      await ctx.sendChatAction("typing");

      try {
        const userRequestURL = process.env.API_REQ + ctx.payload + process.env.API_KEY;
        const userResponse = await axios.get(userRequestURL);
        const grouptRequestURL = process.env.API_REQ+process.env.USERS+process.env.API_KEY;
        const groupResponse = await axios(grouptRequestURL);
        const data = groupResponse.data.result;
        data.sort((a, b) => {
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          return b.rating - a.rating;
        });
        if (userResponse.status === "FAILED") {
          try {
            await ctx.deleteMessage(waitMessage.message_id);
          } catch (error) {}
          await ctx.reply("Please enter a vaid username.");
        } else {
          const userData = userResponse.data.result[0];
          // console.log(userData);
          const index = data.findIndex((user) => user.handle === userData.handle);
          try {
            await ctx.deleteMessage(waitMessage.message_id);
            await ctx.reply(
              `[${userData.firstName || "NO Name"} /${
                userData.handle
              }/](https://codeforces.com/profile/${userData.handle})
  
  __CurrentRating__ : ${userData.rating || "Not rated"}
  __Rank__ : ${userData.rank || "Not rated"}
  __Rank from Group__ : ${index === -1 ? "Not in G53" : index + 1}
  __Maximum Rating__ : ${userData.maxRating || "Not rated"}
  __Maximum Rank__ : ${userData.maxRank || "Not rated"}`,
              {
                parse_mode: "MarkdownV2",
              }
            );
          } catch (error) {
            console.log("Something went wrong when replying to user");
            console.log(error);
          }
        }
      } catch (error) {
        await ctx.reply("Something went wrong when fetching data")
        console.log("Something went wrong when fetching data");
        console.log(error);
      }

    } else {
      try {
        await ctx.deleteMessage(waitMessage.message_id);
      } catch (error) {}
      await ctx.reply("Please enter username after /user command.");
    }
  });
};