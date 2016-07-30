import {CronJob} from 'cron';

export default class AuctionTimer {

  constructor(auctionChant) {
    this._auctionChant = auctionChant;

    this._timedFunctions = [];

    this._job = new CronJob({
      cronTime: '* * * * * *',
      onTick: this._timerFunc.bind(this),
      start: false,
      timeZone: 'Europe/Rome'
    });
  }

  schedule(func) {
    this._timedFunctions
      .push(func);
  }

  start() {
    this._job.start();
  }

  _timerFunc() {
    this._timedFunctions.forEach(func => {
      func();
    });
  }
}
