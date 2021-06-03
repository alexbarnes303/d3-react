const WebSocket = require('ws');
const _ = require('lodash');
const {
  OPTIONS,
  MAX_LENGTH,
  DURATION,
  SAMPLE_SIZE,
  MAX_VALUE,
  MIN_VALUE,
  PORT,
} = require('./constants');

let wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (socket) => {
  let limits = { min: MIN_VALUE, max: MAX_VALUE };    ;
  let dataPoint;
  let seedData;
  let option; 
  let field;
  let msg;
  let interval;

  const updateData = () => {
    dataPoint = createDataPoint(limits);
    console.log('data point: ', dataPoint);
    socket.send(JSON.stringify({ type: 'update', payload: dataPoint}));
  }

  socket.on('message', (evt) => {  
    msg = JSON.parse(evt);
    console.log('server msg:', msg)
    if (msg.type === 'open' || msg.type === 'change') {
      // set filters and limits, generate seed data and set timing interval for updateData
      option = OPTIONS.find((o) => o.name === msg.payload.filter);
      field = option.fields.find((f) => f.value === msg.payload.value);
      limits = { min: field.min, max: field.max };   
      seedData = generateSeedData(limits);
      console.log('seed data: ', seedData);
      socket.send(JSON.stringify({ type: 'seed', payload: seedData}));
      clearInterval(interval);
      interval = setInterval(updateData, DURATION);
    } else {
      console.log('server recieved an unidentified request type', msg.type)
    }
  });

  socket.on('close', (evt) => {
    clearInterval(interval);
    console.log('websocket has closed', evt); 
    if (evt.code !== 1000) {
      wss = new WebSocket.Server({ port: PORT });
      console.log('trying to reconnect to websocket'); 
      console.log('trying to reconnect to websocket'); 
    }
  });
  
  socket.on('error', (evt) => {
    console.log('websocket error:', evt)
    clearInterval(interval);
  });
});


// utility functions

const generateSeedData = (limits) => {
  const now = new Date();
  const seedData = []
    for (let i = 0; i < MAX_LENGTH; i++) {
      let sample = [];
      for (let i = 0; i < SAMPLE_SIZE; i++) {
        sample.push(randomNumberBounds(limits))
      }
      seedData.push({
        time: new Date(now.getTime() - ((MAX_LENGTH - i) * DURATION)),
        min: _.min(sample),
        max: _.max(sample),
        mean: _.mean(sample),
      });
  }
  return seedData;
}

const createDataPoint = (limits) => {
  let now = new Date();
  let values = [];
  for (let i = 0; i < 5; i++) {   
    values.push(randomNumberBounds(limits));
  }
  const dataPoint = {
    time: now,
    min: _.min(values),
    max: _.max(values),
    mean: _.mean(values),
  };
  return dataPoint;
}

const randomNumberBounds = ({ min, max }) => {
  return Math.floor(Math.random() * max) + min;
}


