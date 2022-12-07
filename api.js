const request = require("request");
const TelegramBot = require("node-telegram-bot-api");
var serviceAccount = require("./serviceAccountKey.json");
const token = "5658072857:AAHbidCCC0FFvTwWo_54pHociOL_elXL25c";
const bot = new TelegramBot(token, { polling: true });
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
bot.on("message", function (msg) {
  request(
    "http://api.weatherapi.com/v1/current.json?key=18706d8e081e4fc5842122252221611&q=" +
      msg.text +
      "&aqi=yes",
    function (error, response, body) {
      //console.log(JSON.parse(body));
      if (JSON.parse(body).Response == undefined) {
        bot.sendMessage(
          msg.chat.id,
          "Location :" + JSON.parse(body).location.name
        );
        bot.sendMessage(
          msg.chat.id,
          "region :" + JSON.parse(body).location.region
        );
        bot.sendMessage(
          msg.chat.id,
          "country :" + JSON.parse(body).location.country
        );
        bot.sendMessage(
          msg.chat.id,
          "temperature in celsius :" + JSON.parse(body).current.temp_c
        );
        db.collection("temperature").add({
          location: JSON.parse(body).location.name,
          region: JSON.parse(body).location.region,
          country: JSON.parse(body).location.country,
          currenttemperature: JSON.parse(body).current.temp_c,
        });
      } else {
        bot.sendMessage(msg.chat.id, "location not found");
      }
    }
  );
});
