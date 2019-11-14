import cron from 'cron';

export default class AuctionTimer {
  constructor() {
    this._timerTicks = 0;

    this._timedFunctions = [];

    this._job = new cron.CronJob({
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
    this._timerTicks++;

    this._timedFunctions.forEach((func) => {
      func(this._timerTicks);
    });
  }
}
