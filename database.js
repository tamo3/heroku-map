// Node.js database module.
// const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');

//  URL for Heroku/mLab MongoDB.
const dbUrl = 'mongodb://heroku_tvsq48kq:7rv7942mg8365kipoj8a8rad2i@ds139342.mlab.com:39342/heroku_tvsq48kq';

let dbConnected = false;


// Define event schema.
const eventSchema = mongoose.Schema({
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
const Event = mongoose.model('events', eventSchema);


// For debugging: print data to console.
function debugListEvents(ev, db) {
  ev.find({ $query: {}, $orderby: { start: 1 } }).then(docs => {         // Print to console.
    docs.forEach(doc => {
      console.log('Name of event: ' + doc['name'] + 'web: ' + doc['web']);
    });
  }).catch(err => {
    console.log(err)
  })
}

// Function to cnnect to MongoDB.
function connect() {
  // Referense: https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/mongooseSimpleExample.js
  // https://mongoosejs.com/docs/
  mongoose.connect(dbUrl, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback() { // Callback on open.



    // Check if the database is empty, reference:// https://stackoverflow.com/questions/37459215/check-if-mongodb-database-is-empty-via-db-collection-count-doesnt-work
    db.db.collection('events').countDocuments((err, count) => {
      if (err) {
        console.dir(err);
      }
      else {
        console.log(`Number of events in DB: ${count}`);
        if (count > 0) {
          dbConnected = true;
          debugListEvents(Event, db);
        }
        else {
          // No data in database, so create sample events.
          console.log(`Creating dummy events...`);
          let dining = new Event({
            start: '2020-03-01T09:00:00.000-8:00',
            end: '2020-03-31T09:00:00.000-8:00',
            name: 'Portland Dining Month',
            loc: {
              type: "Point",
              coordinates: [-122.698687, 45.526974]  // [lng, lat] -- different from Google Map!  Need to swap!
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
              coordinates: [-122.680712, 45.509871]  // [lng, lat] -- different from Google Map!  Need to swap!
            },
            web: 'https://www.travelportland.com/dining-month/?neighborhood=all&cuisine=all',
            desc: 'This is just an example.'
          });
          let list = [dining, tmpEvent];
          Event.insertMany(list)    // Insert to the DB.
            .then(() => {             // Query example.
              dbConnected = true;
              return Event.find({ $query: {}, $orderby: { start: 1 } });
            })
            .then(docs => {         // Print to console.
              docs.forEach(doc => {
                console.log('Name of event: ' + doc['name'] + 'web: ' + doc['web']);
              });
            })
            // .then(() => {
            //   // Since this is an example, we'll clean up after ourselves.
            //   return mongoose.connection.db.collection('events').drop()
            // })
            // .then(() => {
            //   // Only close the connection when your app is terminating
            //   return mongoose.connection.close()
            // })
            .catch(err => {
              // Log any errors that are thrown in the Promise chain
              console.log(err)
            })
        }
      }
    })
  });
}



module.exports = {
  conntct: connect,     // Associate connect function as 'connect'.
  Event: Event,         // Database model.
};
