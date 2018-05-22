const express = require('express');
const jade = require('jade').__express;

const router = express.Router();
const app = express();

app.engine('jade', jade);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));

app.listen(3000, () => {
  console.log('Payment server started')
});


// gateway1
const gateway1 = express();
const gateway1Route = require('./gateway/gateway1');
gateway1.use('/', gateway1Route);

gateway1.listen(3001, () => {
  console.log('Payment gateway 1 started')
});


// gateway2
const gateway2 = express();
const gateway2Route = require('./gateway/gateway2');
gateway2.use('/', gateway2Route);

gateway2.listen(3002, () => {
  console.log('Payment gateway 2 started')
});
