import paypal from 'paypal-rest-sdk';
import Bluebird from 'bluebird';

Bluebird.promisifyAll(paypal);
Bluebird.promisifyAll(paypal.payment);

export default class PayPal {
  constructor({
    env, client_id, client_secret, returnUrl, cancelUrl
  }) {
    paypal.configure({
      mode: env, // sandbox or live
      client_id,
      client_secret
    });
    this.returnUrl = returnUrl;
    this.cancelUrl = cancelUrl;
  }

  getPayRedirectUrl(itemDescription, amount, currency) {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: this.returnUrl,
        cancel_url: this.cancelUrl
      },
      transactions: [{
        amount: {
          currency,
          total: amount.toFixed(2).toString()
        },
        description: itemDescription
      }]
    };

    return paypal
      .payment
      .createAsync(create_payment_json)
      .then((payment) => Promise.resolve(payment.links.find((x) => x.method === 'REDIRECT').href));
  }
}
