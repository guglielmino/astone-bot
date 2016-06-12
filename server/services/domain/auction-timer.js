import {CronJob} from 'cron';

export default class AuctionTimer {

  constructor(auctionChant, eventEmitter) {
    this._auctionChant = auctionChant;
    this._eventEmitter = eventEmitter;

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
    this
      ._auctionChant
      .make();
  }
}
