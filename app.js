var restify = require('restify');
var builder = require('botbuilder');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var welcomeMessage = "Hi Pal, My name is Turing, I really care about you, just let me know how you're feeling right now";
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
function () {
    console.log('%s listening to %s', server.name, server.url);
});
// chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '',//process.env.MICROSOFT_APP_ID,
    appPassword: ''//process.env.MICROSOFT_APP_PASSWORD
});
// Listen for messages from users
server.post('/api/messages', connector.listen());
// var result = sentiment.analyze('Cats are stupid.');

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
  // console.log("the log is ",sentiment.analyze(session.message.text));
  // session.send("Turing Says: %s", sentiment.analyze(session.message.text).score);
  // session.send("Turing Says: %s", session.message.text);
  var sentimentQuotient = sentiment.analyze(session.message.text).score;
  var message = "";
  if(sentimentQuotient>=4 && sentimentQuotient<5){
    message = "You seems to be very Joyful"
  }else if (sentimentQuotient>=2 && sentimentQuotient<4) {
    message = "You seems to be Happy."
  }else if (sentimentQuotient>=1 && sentimentQuotient<2) {
    message = "You seems to be Relaxed"
  }else if (sentimentQuotient==0) {
    message = "You seems to be Relaxed and Eased"
  }else if (sentimentQuotient>=-2 && sentimentQuotient<-1) {
    message = "You seems to be Sad"
  }else if (sentimentQuotient>=-3 && sentimentQuotient<-2) {
    message = "You seems to be so Stressed"
  }else if (sentimentQuotient>=-5 && sentimentQuotient<-3) {
    message = "You seems to be Panicced"
  }
  session.send("Turing Says: %s", message);
  console.log("the sentiment of this sentence is ",sentiment.analyze(session.message.text),"    ",sentimentQuotient);
});

bot.on('conversationUpdate', function (message) {
   if (message.membersAdded[0].id === message.address.bot.id) {
         var reply = new builder.Message()
               .address(message.address)
               .text(welcomeMessage);
         bot.send(reply);
   }
});
