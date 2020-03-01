// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.





// Referense: https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/mongooseSimpleExample.js
const dbUrl = 'mongodb://heroku_tvsq48kq:7rv7942mg8365kipoj8a8rad2i@ds139342.mlab.com:39342/heroku_tvsq48kq';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {

  // Create event schema.
  let eventSchema = mongoose.Schema({
    start: String,
    end: String,
    name: String,
    loc: { // Reference: https://mongoosejs.com/docs/geojson.html
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    },
    web: String,
    desc: String
  });

  // Store event documents in a collection called "events"
  let Event = mongoose.model('events', eventSchema);

  // Create sample events.
  let dining = new Event({
    start: '2020-03-01T09:00:00.000-8:00',
    end: '2020-03-31T09:00:00.000-8:00',
    name: 'Portland Dining Month',
    loc: {
      type: "Point",
      coordinates: [-122.698687, 45.526974 ]  // [lng, lat] -- different from Google Map!  Need to swap!
    },
    web: 'https://www.travelportland.com/dining-month/?neighborhood=all&cuisine=all',
    desc: 'Every March, the city’s top restaurants offer three-course meals for a great price, making it the best time to experience one of the nation’s most talked-about culinary destinations – affordably.'
  });
  let tmpEvent = new Event({
    start: '2020-03-01T09:00:00.000-8:00',
    end: '2020-03-31T09:00:00.000-8:00',
    name: 'Test event @PSU',
    loc: {
      type: "Point",
      coordinates: [-122.680712, 45.509871 ]  // [lng, lat] -- different from Google Map!  Need to swap!
    },
    web: 'https://www.travelportland.com/dining-month/?neighborhood=all&cuisine=all',
    desc: 'This is just an example.'
  });

  let list = [dining, tmpEvent];

  Event.insertMany(list)    // Insert to the DB.
  .then(() => {             // Query example.
    return Event.find({ $query: {}, $orderby: {start: 1}});
   
  }).then(docs => {         // Print to console.
    docs.forEach(doc => {
      console.log('Name of event: ' + doc['name'] + 'web: ' + doc['web']);
    });

  }).then(() => {
    // Since this is an example, we'll clean up after ourselves.
    return mongoose.connection.db.collection('events').drop()

  }).then(() => {

    // Only close the connection when your app is terminating
    return mongoose.connection.close()

  }).catch(err => {

    // Log any errors that are thrown in the Promise chain
    console.log(err)

  })
});




// app.use(express.static(path.join(__dirname, 'client/build')));
console.log('PUBLIC_URL is: ', process.env.PUBLIC_URL);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));  
}
else { // TT: not sure if this is needed.
  app.use(express.static(path.join(__dirname, 'client/public')));  
}

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  console.log('server app.get called');
  res.send({ "express": "Hello from Express!" });
});


