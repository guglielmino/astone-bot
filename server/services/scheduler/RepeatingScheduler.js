import AsyncPolling from 'async-polling';

export default class RepeatingScheduler {

	schedule(func, delay) {
		if (!this.polling) {
			this.polling = AsyncPolling((end) => {
				func();
				end();
			}, delay);
			this.polling.run();
		}
	}

	start() {
		if (this.polling) {
			this.polling.run();
		}
	}

	stop() {
		if (this.polling){
			this.polling.stop();
		}
	}
}
