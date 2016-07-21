*Astone* is the first Auction bot for Telegram.
Here a list of commands for using it:

/list => show the active auctions
/newauction => start flow for creating an auction
/help => these informations

When a user create an auction he/she must give a series of informations about it, these are:
- A title
- A picture of the object which he want to sell
- A description
- A starting price
- The minimum number of participants to start the auction

After these informations are inserted a review process starts to check if the Auction is valid.
If Auction will deemed appropriated it'll assigned a date and it's ready to run.
Pay particular attention to minimum number of participant value. Putting it to 0
makes the auction start when even just one participant bid to it, with risk to sell the item at
very low price. On the other hand putting it to a too big number give the risk of never starting it.


*NOTE*: at this time Astone is in _BETA_, You can try to make Auctions and bid on existing
ones but the auctions never close and object aren't assigned to winner

Send feedback to @guglielmino
