const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const mongoose        = require('mongoose');
const routes          = require('./api/router');
const session         = require('express-session');
const MongoStore      = require('connect-mongo')(session);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use((err, req, res, next) => {
    res.status(422).send({
        error: err.message
    });
});

app.listen(process.env.port || 4000, () => {
    console.log('Server Running on port 4000...');
});
