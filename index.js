const app = require('./app');
const connectWithDb = require('./config/db');
// const { connectWithRedis } = require('./config/redis');
require('dotenv').config();

//Database connection
connectWithDb();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
