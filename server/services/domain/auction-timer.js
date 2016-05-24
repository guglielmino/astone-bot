import {CronJob} from 'cron';

const ageMessages = {
	65: (auction) => `No one offer more than € ${auction.price} ?`,
	70: (auction) =>`Come on, don't be shy, make an offer`,
	90: (auction) =>`*€ ${auction.price}* and one`,
	95: (auction) =>`*€ ${auction.price}* and two`,
	100: (auction) =>`*€ ${auction.price}* and three`,
	103: (auction) =>`*${auction.title}* sold for *€ ${auction.price}*  💰`,
}
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
		const now = new Date();
		this._auctionManager
			.getRunningAuctionsBidAge(now, 60)
			.then((res) => {
					res.forEach((auction) => {
						this._handleAuctionMessage(auction);
					});
			});
	}

	_handleAuctionMessage(auction) {
		if(auction.bidAge > 60) {
			console.log(`Auction ${auction.title} - ${auction.bidAge}`);
			this._sendMessageToSubscribers(auction, ageMessages[auction.bidAge](auction))
		}
	}

	_sendMessageToSubscribers(auction, message){
		auction.subscribers.forEach((subscriber) => {
			this._telegram.sendMessage({
				chat_id: subscriber.chatId,
				text: message,
				parse_mode: 'Markdown'
			});
		});
	}



}