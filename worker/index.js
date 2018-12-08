const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  // Every time we get an new value in redis
  // We are going to calculate a new fibonacci value
  // and we gonna insert hased into values
  // The key will the index (message) and the value will be the
  // fib value
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');

