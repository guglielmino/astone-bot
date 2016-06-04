'use strict';

import bluebird from 'bluebird';
import redis from 'redis';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default (config) => {
	const client = redis.createClient({
		host: config.redis.host,
		port: config.redist.port,
		db: config.redis.db
	});

	return {
		getKey: (key) => {
			return client.getAsync(key);
		}
	}
}