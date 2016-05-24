'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class BidCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;

		this._responses = {
			'Success': (state, auction) => {

				const currentPrice = auction.price.toFixed(2);
				const nextBid = parseFloat(auction.price + parseFloat(auction.bidStep || 1.00)).toFixed(2);
				const bidRespMessage = `*€ ${currentPrice}* bid, now ${nextBid}, now ${nextBid}, will ya give me *€ ${nextBid}* ?`;

				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Bid accepted!', false);

				auction.subscribers
					.forEach((subscriber) => {
						this
							._sendMessageToSubscriber(subscriber, bidRespMessage, nextBid);
					});
			},
			'NotAccepted': (state, auction) => {
				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Bid NOT accepted!', false);
				this.simpleResponse(state.chat.id, this.t('Offer can\'t be accepted. Try again.'));
			},
			'ValueToLow': (state, auction) => {
				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Bid NOT accepted!', false);
				this.simpleResponse(state.chat.id, this.t(`Your offer is lower than current value (€ ${auction.price})`));
			},
			'AuctionNotActive': (state, auction) => {
				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Bid NOT accepted!', false);
				this.simpleResponse(state.chat.id, this.t('Can\'t bid on this Auction because is inactive'));
			},
			'InsufficientSubscribers': (state, auction) => {
				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Bid NOT accepted!', false);
				this.simpleResponse(state.chat.id, `We need at least *${auction.minSubscribers || 10}* participants to start the Auction`);
			}
			,
			'AuctionClosed': (state, auction) => {
				this._telegram
					.answerCallbackQuery(state.callback_query_id, 'Auction closed', false);
				this.simpleResponse(state.chat.id, `This auction is closed and can't accept bidding`);
			}
		};
	}

	execute(state, ...params) {

		if (!state.auctionId) {
			return this.simpleResponse(state.chat.id, this.t('Before bidding You must choose an active auction'));
		}

		if (params.length > 0) {
			const bidValue = parseFloat(params[0]);
			if (bidValue > 0.0) {
				return this._auctionManager
					.bid(state.auctionId, {username: state.chat.username}, bidValue)
					.then((res) => {
						if (res.status.name in this._responses) {
							this._responses[res.status.name](state, res.auction);
						}

						Promise.resolve(null);
					});
			}
		}
	}

	_sendMessageToSubscriber(subscriber, bidRespMessage, nextBid) {
		this._telegram
			.sendMessage({
				chat_id: subscriber.chatId,
				text: bidRespMessage,
				parse_mode: 'Markdown',
				reply_markup: {
					inline_keyboard: [[{
						text: `Bid € ${nextBid}`,
						callback_data: this.encodeQueryCommand(constants.QCOMMAND_BID, nextBid)
					}]
					]
				}
			});
	}

}
