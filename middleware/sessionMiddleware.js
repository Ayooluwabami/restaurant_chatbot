const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/session-store',
  collection: 'sessions'
});

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 } // 1 day
});

module.exports = sessionMiddleware;
