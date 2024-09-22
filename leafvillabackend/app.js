const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
require('dotenv').config();
// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
log4js.configure('./log.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));

const indexRouter = require('./routes/index_routes');
app.use('/', indexRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port" + PORT);
}); 