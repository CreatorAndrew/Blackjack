import Card from './Card.js'

class Deck {
    constructor() {
        this.cards = []
        this.dealtCards = []
        this.reservedCards = []

        for (let suit = 0; suit < 4; suit++)
            for (let face = 1; face <= 13; face++)
                this.cards.push(new Card(face, suit))
    }

    shuffle() {
        while (this.dealtCards.length) this.cards.push(this.dealtCards.pop())
        var tempCard, tempValue
        for (let i = 0; i < this.cards.length && this.cards.length; i++) {
            tempValue = Math.floor(Math.random() * this.cards.length)
            tempCard = this.cards[tempValue]
            this.cards[tempValue] = this.cards[i]
            this.cards[i] = tempCard
        }
    }

    deal() {
        if (!this.cards.length) return new Card()
        this.dealtCards.push(this.cards.pop())
        return this.dealtCards[this.dealtCards.length - 1]
    }

    reserveCards(cards) {
        for (let i = 0; i < cards.length; i++)
            for (let j = 0; j < this.dealtCards.length; j++)
                if (cards[i] === this.dealtCards[j]) {
                    this.reservedCards.push(this.dealtCards[j])
                    this.dealtCards.splice(j, 1)
                    break
                }
    }

    unreserveCards() {
        while (this.reservedCards.length) this.dealtCards.push(this.reservedCards.pop())
    }

    isEmpty() {
        return !this.cards.length
    }
}

export default Deck
