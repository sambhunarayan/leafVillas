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
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '/public', 'index.html'));
});
const indexRouter = require('./routes/indexRoutes');
app.use('/api', indexRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log('Server running on port' + PORT);
});
