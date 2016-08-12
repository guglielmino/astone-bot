'use strict';

import * as urlConsts from './url-consts';
import logger from '../services/logger';

const VALIDATION_TOKEN = 'EAADzZAuPFqTEBAEQNpyDlGYnd7dcPAgvi3ZBjYMxpFsusvDlvBThZAZAGCFrS6zoZCjQkVfg31VXhCQtLb1027OTZCJ6v61NxYB9PpcbywZBKGXXhRxeIh8OLrRkBJhnZCFZA8mMpQPYzMmLz1VeOsZBrpDvniaG0k2vpuiOF9eEzVDAZDZD';

export default (router) => {

  router.get(urlConsts.API_MESSENGER_UPDATE, async(ctx) => {
    if (ctx.request.query['hub.mode'] === 'subscribe' &&
      ctx.request.query['hub.verify_token'] === VALIDATION_TOKEN) {
      console.log("Validating webhook");
      ctx.status = 200;
      ctx.body = ctx.request.query['hub.challenge'];
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      ctx.status = 403;
    }
  });

  router.post(urlConsts.API_MESSENGER_UPDATE, async(ctx) => {
    let data = ctx.request.body;

    if (data.object == 'page') {

      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(pageEntry => {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;

        // Iterate over each messaging event
        pageEntry.messaging.forEach(messagingEvent => {
          console.log(messagingEvent);
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      ctx.status = 200;
    }
  });
};
