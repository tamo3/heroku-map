// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
const myDb = require('./database.js'); // Import databas.js module.

const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.


myDb.conntct(); // Connect to MongoDB.

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

// Route: /express_backend -- for debugging.
app.get('/express_backend', (req, res) => {
  console.log('server app.get /express_backend called');
  res.send({ "express": "Hello from Express!" });
});

// Route for MongoDB access:
app.get('/api', (req, res) => {
  console.log('server app.get /api called');
  myDb.Event.find({ $query: {}, $orderby: { start: 1 } }).then(docs => { 
    let i = 0; 
    docs.forEach(doc => { // Print to log for debugging.
      console.log(`[${i}] : ` + doc['name'] + 'web: ' + doc['web']);
    });
    res.send(docs); // Send data as response.
  }).catch(err => {
    console.log(err)
  })
});

// todo: Create/POST (for adding new data), DELETE (for deleting existing entry).


