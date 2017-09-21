

## Astone - The Bot for Bidding

Astone is a Telegram Bot for online auctions.

It supports some simple commands to create an auction or to bid on a existing one.

(TO DO: Extend with animated gif of a sample auction)

# Install notes

(TO DO)


# Telegram bot deep linking

Telegram can deep link a bot with a specific url in the format:
`https://telegram.me/{BotName}`

In the case of Astone the stantard deep linking url will be

`https://telegram.me/AstoneBot`

Deep link can pass parameters to Bot's start, to pass parameter url must have a query string
key called start. This parameter is used to generate a link with deeplinking of a auction, this
is useful for sharing the auction, the url with deeplinking of the auction will be:

`https://telegram.me/AstoneBot?start=auc:1234`

Where `1234` is the auction identifier, must be payed attention to parameter value length because
it must be max 64 characters long.


