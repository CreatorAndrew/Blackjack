class Card {
    constructor(faceNum = 0, suitNum = 0) {
        this.faceNum = faceNum
        this.suitNum = suitNum
        this.ace = 11
    }

    face() {
        switch (this.faceNum) {
            case 1: return "Ace"
            case 11: return "Jack"
            case 12: return "Queen"
            case 13: return "King"
            default: return "" + this.faceNum
        }
    }

    suit() {
        switch (this.suitNum) {
            case 1: return "Diamonds"
            case 2: return "Hearts"
            case 3: return "Spades"
            default: return "Clubs"
        }
    }

    faceValue() {
        switch (this.faceNum) {
            case 1: return this.ace
            case 11:
            case 12:
            case 13: return 10
            default: return this.faceNum
        }
    }

    setAce(ace) {
        this.ace = ace
    }

    imageName() {
        return (isNaN(this.face()) ? this.face().charAt(0) : this.face()) + "o" + this.suit().charAt(0) + ".gif"
    }
}

export default Card
