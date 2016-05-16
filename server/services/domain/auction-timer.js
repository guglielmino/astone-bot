import {CronJob} from 'cron';

export default class AuctionTimer {
	
	constructor(telegram, i18n, auctionManager) {
		this._telegram = telegram;
		this._i18n = i18n;
		this._auctionManager = auctionManager;
		this._job = new CronJob({
			cronTime: '* * * * * *',
			onTick: this._timerFunc.bind(this),
			start: false,
			timeZone: 'Europe/Rome'
		});
	}

	start() {
		this._job.start();
	}

	_timerFunc() {
		this._auctionManager
			.getActiveAuctions()
			.then((res) => {

			});

	}
}