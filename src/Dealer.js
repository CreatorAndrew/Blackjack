import Player from './Player.js'
import Deck from './Deck.js'

class Dealer extends Player {
    constructor(name) {
        super(name)
        this.deck = new Deck()
    }

    shuffle() {
        this.deck.shuffle()
    }

    deal() {
        return this.deck.deal()
    }

    deckIsEmpty() {
        return this.deck.isEmpty()
    }

    reserveCards(cards) {
        cards.forEach(card => card.setAce(11))
        if (cards) this.deck.reserveCards(cards)
    }

    unreserveCards() {
        this.deck.unreserveCards()
    }
}

export default Dealer
