// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

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


