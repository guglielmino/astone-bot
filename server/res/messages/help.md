*Astone* is the first Auction bot for Telegram.
Here a list of commands for using it:

/list => shows the active auctions, the ones can be subscribed to bid on
/newauction => starts flow for creating an auction
/settitle => changes title of an existing auction (🔺)
/setdescr => changes description of an existing auction (🔺)
/setprice => changes starting price of an existing auction (🔺)
/setpicture => changes item picture of an existing auction (🔺)
/setminsub => changes min number of participants of an existing auction (🔺)
/help => shows these informations

_🔺Only for auction not already running_

When a user create an auction he/she must give a series of informations about it, these are:
- A title
- A picture of the object which he want to sell
- A description
- A starting price
- The min number of participants to start the auction

After these information are inserted a review process starts to check if the Auction is valid.
If Auction will deemed appropriated it'll assigned a date and it's ready to run.
Pay particular attention to minimum number of participant value. Putting it to 0
makes the auction start when even just one participant bid to it, with risk to sell the item at
very low price. On the other hand putting it to a too big number give the risk of never starting it.


*NOTE*: at this time Astone is in _BETA_, You can try to make Auctions and bid on existing
ones but the auctions never close and object aren't assigned to winner

Send feedback to @guglielmino
