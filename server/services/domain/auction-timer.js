import cron from 'cron';

const AuctionTimer = () => {
  let timerTicks = 0;
  const timedFunctions = [];

  const timerFunc = () => {
    timerTicks += 1;

    timedFunctions.forEach((func) => {
      func(timerTicks);
    });
  };

  const job = new cron.CronJob({
    cronTime: '* * * * * *',
    onTick: timerFunc,
    start: false,
    timeZone: 'Europe/Rome'
  });

  return {
    schedule(func) {
      timedFunctions
        .push(func);
    },

    start() {
      job.start();
    }
  };
};

export default AuctionTimer;
