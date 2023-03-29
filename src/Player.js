import Card from './Card.js'

class Player {
    constructor(name) {
        this.name = name
        this.score = 500
        this.bet = this.handsDone = 0
        this.hands = [[]]
        this.isActive = this.hasInsurance = this.blackJackSkip = false
    }

    setName(name) {
        this.name = name
        return name
    }

    setScore(score) {
        this.score = score
    }

    setActive(bool) {
        this.isActive = bool
    }

    setHasInsurance(bool) {
        this.hasInsurance = bool
    }

    setBlackJackSkip(bool) {
        this.blackJackSkip = bool
    }

    getHandCard(i, j) {
        if (this.hands[i][j]) return this.hands[i][j]
        else return new Card()
    }

    addCardToHand(card, num = this.getNextHand()) {
        if (this.hands[num]) this.hands[num]?.push(card)
        for (let i = 0; i < this.hands[num]?.length; i++)
            if (this.hands[num][i]?.faceNum === 0) this.hands[num]?.splice(i, 1)
    }

    resetAllHands() {
        this.hands = [[]]
        this.handsDone = 0
        this.blackJackSkip = false
    }

    getHand(num = this.getNextHand()) {
        return this.hands[num]
    }

    getNextHand() {
        return this.handsDone
    }

    setNextHandDone() {
        this.handsDone++
    }

    getHandValue(num = this.getNextHand()) {
        let value = 0
        this.hands[num]?.forEach(card => value += card?.faceValue())
        return value
    }

    getHandSize(num = this.getNextHand()) {
        return this.hands[num]?.length
    }

    getHandsAmount() {
        return this.hands?.length
    }

    handBeforeIndex(num) {
        return this.getNextHand() < num
    }

    setAce(num = this.getNextHand()) {
        if (this.getHandValue(num) > 21)
            for (let i = 0; i < this.hands[num].length; i++) {
                if (this.getHandValue(num) <= 21) break
                this.hands[num][i].setAce(1)
            }
    }

    resetAllAces(num = this.getNextHand()) {
        this.hands[num].forEach(card => card.setAce(11))
    }

    canSplitHand(num = this.getNextHand()) {
        return this.getHand(num)?.length === 2 && this.getHand(num)[0]?.faceNum === this.getHand(num)[1]?.faceNum
    }

    splitHand() {
        if (this.canSplitHand()) this.hands.push([this.getHand().pop()])
    }
}

export default Player
