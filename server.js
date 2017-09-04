'use strict';

const app = require('./app');
const {SERVER_PORT} = process.env;

app.set('port', SERVER_PORT);

const server = app.listen(app.get('port'), () => {
    console.log(`Server running → PORT ${server.address().port}`);
});
