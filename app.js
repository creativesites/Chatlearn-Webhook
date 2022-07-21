const {
    dialogflow,
    Image,
  } = require('actions-on-google');
  const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
try {
    mongoose.connect('mongodb+srv://admin:higibertigibet@cluster0.abb0bhi.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
        console.log('db connected webhook') 
  } catch (error) {
    console.log(error)
  }
const User = require('./models/User');
   
  // Create an app instance
  const app = dialogflow()
  
  // Register handlers for Dialogflow intents
  const expressApp = express().use(bodyParser.json())

expressApp.post('/fulfillment', (req, res)=>{
    console.log(JSON.stringify(req.body))
    let userId = req.body.session.slice( -17);
    let userNum = userId.slice(0, -5);

    app.intent('Default Welcome Intent', conv => {
        User.findById(userId, async function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");

            }
            if (doc == null){
                const addNew = new User({_id: userId, registered: false, number: userNum});
                addNew.save(function (err, doc) {
                    if (err) 
                        return console.error(err);
                    console.log("Document inserted succussfully!");
                    console.log(doc);
                });
                const lifespan = 5;
                conv.contexts.set('no-details0000', lifespan);
                conv.ask('👋 Hello! Before we get started, let me get a few details.\nWhat is your first name?')
            }else{
              conv.contexts.set('no-details0001', lifespan);
              conv.ask('👋 Hello!')
            }
        })
        
        // conv.ask(new Image({
        //   url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        //   alt: 'A cat',
        // }))
    })
      
    // Intent in Dialogflow called `Goodbye`
    app.intent('Goodbye', conv => {
    conv.close('See you later!')
    })
    
    app.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`)
    })
})
expressApp.get('/', (req, res)=>{
  res.send('Webhook resp')
})

expressApp.listen(8080)
  