import React, { Component } from "react"
import Dealer from './Dealer.js'
import Player from './Player.js'
import ListedPlayer from './ListedPlayer.js'
import InsuranceDialog from "./InsuranceDialog.js"
import BetDialog from './BetDialog.js'
import './PlayerMenu.css'

const Columns = (props) => <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
  <div>{props.listedPlayers}</div>
  <div>{props.log}</div>
  <div>{props.players ? props.players?.map(player => 
    <div className="rightSide" key={props.players.indexOf(player)}>{player.name}'s Balance: ${(Number(player.score) -
      Number((player.blackJackSkip
        && !playerHadNoSpecialEvent(player)
        && !playerHadNoSpecialEvent(props.dealer)) 
        ? player.bet * props.bonusMultiplier : 0)).toFixed(2)}
    </div>) : ""}
  </div>
</div>

function playerHadNoSpecialEvent(player, num = 0) {
  return (player.getHandValue(num) < 21 || player.getHandSize(num) > 2) && player.getHandValue(num) <= 21
}

class PlayerMenu extends Component {
  state = ({ players: [], dealer: new Dealer("Dealer"), nextPlayer: 0, insuranceDialogOn: false, betDialogOn: true, log: [] })
  hasMargin = true
  bonusMultiplier = 1.5
  nextPlayer = this.state.nextPlayer
  log = this.state.log

  componentDidMount() {
    this.state.dealer.shuffle()
    this.setState({ dealer: this.state.dealer })
  }

  componentDidUpdate() {
    let topBar = document.getElementById("log")
    topBar.scrollTop = topBar.scrollHeight
  }

  margin() {
    return this.hasMargin ? ({ marginLeft: '1rem' }) : ({})
  }

  renderDealer() {
    return <>
      <b>{this.state.dealer.name}</b>
      <br/>
      {this.state.dealer.getHand()[0] ?
        <div style={this.margin()}>
          Hand:
          <br/>
          <img src={require("./Images/" + this.state.dealer.getHand()[0].imageName())}
            alt={this.state.dealer.getHand()[0]?.face() + " of " + this.state.dealer.getHand()[0]?.suit()}/>
          &nbsp;<img src={require("./Images/back.gif")} alt="Card unrevealed"/>
        </div> : ""}
    </>
  }

  renderLog() {
    return <div id="log" className="topBar">
      {this.state.log.map((logItem) => <span style={{ WebkitTextFillColor: logItem.color, overflow: "hidden" }} 
        key={this.log.indexOf(logItem)}>{logItem.message}<br/></span>)}
    </div>
  }

  setUpRound(player, skipInsuranceDialog = false) {
    while (this.state.dealer.getHandSize() < 2) {
      if (this.state.dealer.deckIsEmpty()) this.state.dealer.shuffle()
      this.state.dealer.addCardToHand(this.state.dealer.deal())
    }

    while (player.getHandSize(0) < 2) this.handleHit(player)

    if (this.state.dealer.getHand()[0].faceNum === 1 && !skipInsuranceDialog)
      // insurance dialogue
      this.setState({ insuranceDialogOn: true })
    else if (this.state.dealer.getHandValue() === 21 && this.state.dealer.getHandSize() === 2) this.handleStay()
  }

  checkDealerRound() {
    this.state.players.forEach(player => {
      for (let i = 0; i < player.getHandsAmount(); i++)
        while (this.state.dealer.getHandSize()) {
          this.state.dealer.reserveCards(this.state.dealer.getHand())
          if (this.state.dealer.deckIsEmpty()) this.state.dealer.shuffle()
          player.setAce(i)
          this.state.dealer.resetAllAces()

          if (this.state.dealer.getHandValue() === 21 && this.state.dealer.getHandSize() === 2) {
            // dealer gets a blackjack
            if (playerHadNoSpecialEvent(player, i)) {
              this.log.push({ message: this.state.dealer.name + " has a Blackjack! " + player.name + " loses!", color: "red" })
              if (!player.hasInsurance) player.setScore((player.score - player.bet).toFixed(2))
            } else this.log.push({ message: this.state.dealer.name + " and " + player.name + " both have Blackjacks.", color: "yellow" })
            break
          }

          if (this.state.dealer.getHandValue() > 21 && playerHadNoSpecialEvent(player, i)) {
            this.state.dealer.setAce()
            if (this.state.dealer.getHandValue() > 21) {
              // dealer busts
              this.log.push({ message: this.state.dealer.name + " busts! " + player.name + " wins!", color: "lime" })
              player.setScore((Number(player.score) + Number(player.bet)).toFixed(2))
              break
            }
          }

          if (this.state.dealer.getHandValue() < 17 && playerHadNoSpecialEvent(player, i)) {
            this.state.dealer.addCardToHand(this.state.dealer.deal())
          } else if (player.getHandValue(i) > this.state.dealer.getHandValue() && playerHadNoSpecialEvent(player, i)) {
            // player has better hand
            this.log.push({ message: player.name + " has a better hand!", color: "lime" })
            player.setScore((Number(player.score) + Number(player.bet)).toFixed(2))
            break
          } else if (player.getHandValue(i) < this.state.dealer.getHandValue() && playerHadNoSpecialEvent(player, i)) {
            // dealer has better hand
            this.log.push({ message: this.state.dealer.name + " has a better hand than " + player.name + "!", color: "red" })
            player.setScore((player.score - player.bet).toFixed(2))
            break
          } else if (player.getHandValue(i) === this.state.dealer.getHandValue() && playerHadNoSpecialEvent(player, i)) {
            // dealer and player tie
            this.log.push({ message: this.state.dealer.name + " has a hand equal to " + player.name + "'s.", color: "yellow" })
            break
          } else break
        }
    })
    this.state.dealer.unreserveCards()
  }

  handleHit(player, card = this.state.dealer.deal()) {
    if (this.state.dealer.deckIsEmpty()) this.state.dealer.shuffle()
    player.addCardToHand(card)
    this.state.dealer.reserveCards(player.getHand())

    if (player.getHandValue() === 21 && player.getHandSize() === 2) {
      // player gets a blackjack
      this.log.push({ message: player.name + " has a Blackjack!", color: "lime" })
      if (playerHadNoSpecialEvent(this.state.dealer)) player.setScore((Number(player.score) + Number(player.bet) * this.bonusMultiplier).toFixed(2))
      player.setBlackJackSkip(true)
      if (this.state.players.indexOf(player) === this.nextPlayer) this.handleStay()
    } else if (player.getHandValue() > 21) {
      player.setAce()
      if (player.getHandValue() > 21) {
        // player busted
        this.log.push({ message: player.name + " busts!", color: "red" })
        player.setScore((player.score - player.bet).toFixed(2))
        this.handleStay()
      }
    }
    this.setState({ players: this.state.players.slice(), log: this.log })
  }

  handleStay() {
    let next = 1

    for (let i = 0; i < this.state.players.length; i++)
      if (i === this.state.nextPlayer) {
        this.state.players[i].setNextHandDone()
        if (this.state.players[i].handBeforeIndex(this.state.players[i].getHandsAmount())) return
      }

    if (this.nextPlayer === this.state.players.length - 1
        || (this.state.players[this.nextPlayer + next] ? (this.state.players[this.nextPlayer + next]?.blackJackSkip
        && this.nextPlayer + next === this.state.players.length - 1) : false)) {
      this.checkDealerRound()
      for (let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].score <= 0) {
          this.log.push({ message: this.state.players[i].name + " has run out of money! Game Over.", color: "red" })
          this.state.players.splice(i, 1)
          i--
          for (let j = 0; j < this.state.players.length; j++)
            if (this.state.players[j].name.includes("Player ") && this.state.players[j].name !== "Player " + (j + 1))
              this.changePlayerName(this.state.players[j], "Player " + (j + 1))
        }
      }
      for (let i = 0; i < this.state.players.length; i++) this.state.players[i].setActive(i === 0)
      this.nextPlayer = 0
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer, betDialogOn: true, log: this.log })
    } else {
      for (let i = 0; i < this.state.players.length; i++) {
        this.state.players[i].setActive((i === (this.nextPlayer + next)
          || (this.state.players[i - 1] ? (i === (this.nextPlayer + next + 1)
          && this.state.players[i - 1]?.blackJackSkip) : false))
          && !this.state.players[i].blackJackSkip)
        if ((this.state.players[i - 1] ? (i === (this.nextPlayer + next + 1) && this.state.players[i - 1]?.blackJackSkip) : false)) next++
      }
      this.nextPlayer += next
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer })
    }
  }

  handleDouble(player) {
    player.bet *= 2
    this.handleHit(player)
    if (playerHadNoSpecialEvent(player)) this.handleStay()
    this.setState({ players: this.state.players.slice() })
  }

  handleSplit(player) {
    player.splitHand()
    this.setState({ players: this.state.players.slice() })
  }

  handleInsurance(bool) {
    let next = 1

    this.state.players[this.nextPlayer].setHasInsurance(bool)
    if (bool)
      this.state.players[this.nextPlayer].setScore((this.state.players[this.nextPlayer].score - this.state.players[this.nextPlayer].bet / 2).toFixed(2))

    if (this.nextPlayer === this.state.players.length - 1
        || (this.state.players[this.nextPlayer + next] ? (this.state.players[this.nextPlayer + next]?.blackJackSkip
        && this.nextPlayer + next === this.state.players.length - 1) : false)) {
      for (let i = 0; i < this.state.players.length; i++) {
        this.state.players[i].setActive(i === 0)
        this.state.players[i].setBlackJackSkip(false)
      }
      this.nextPlayer = 0
      this.setState({ nextPlayer: this.nextPlayer, insuranceDialogOn: false }, () => this.state.players.forEach(player => this.setUpRound(player, true)))
    } else {
      for (let i = 0; i < this.state.players.length; i++) {
        this.state.players[i].setActive((i === (this.nextPlayer + next)
          || (this.state.players[i - 1] ? (i === (this.nextPlayer + next + 1)
          && this.state.players[i - 1]?.blackJackSkip) : false))
          && !this.state.players[i].blackJackSkip)
        if ((this.state.players[i - 1] ? (i === (this.nextPlayer + next + 1) && this.state.players[i - 1]?.blackJackSkip) : false)) next++
      }
      this.nextPlayer += next
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer })
    }
  }

  handleBet() {
    if (this.nextPlayer === this.state.players.length - 1) {
      if (this.state.dealer.getHand()[0]) {
        this.state.dealer.resetAllHands()
        this.state.players.forEach(player => player.resetAllHands())
      }
      for (let i = 0; i < this.state.players.length; i++) this.state.players[i].setActive(i === 0)
      this.nextPlayer = 0
      this.setState({ players: this.state.players.slice(), dealer: this.state.dealer, nextPlayer: this.nextPlayer, betDialogOn: false }, () => 
        this.state.players.forEach(player => this.setUpRound(player)))
    } else {
      for (let i = 0; i < this.state.players.length; i++) this.state.players[i].setActive(i === this.nextPlayer + 1)
      this.nextPlayer++
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer })
    }
  }

  handleLeave() {
    this.state.players.splice(this.nextPlayer, 1)

    for (let i = 0; i < this.state.players.length; i++)
      if (this.state.players[i].name.includes("Player ") && this.state.players[i].name !== "Player " + (i + 1))
        this.changePlayerName(this.state.players[i], "Player " + (i + 1))

    if (this.nextPlayer < this.state.players.length) {
      this.state.players[this.nextPlayer].setActive(true)
      this.setState({ players: this.state.players.slice() })
    } else if (this.state.players.length) {
      this.nextPlayer--
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer }, () => this.handleBet())
    } else {
      this.nextPlayer = 0
      this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer })
    }

    document.getElementById("Bet")?.focus()
  }

  handleRemove(player) {
    if (this.state.players.indexOf(player) < this.nextPlayer) this.nextPlayer--

    this.state.players.splice(this.state.players.indexOf(player), 1)

    for (let i = 0; i < this.state.players.length; i++)
      if (this.state.players[i].name.includes("Player ") && this.state.players[i].name !== "Player " + (i + 1))
        this.changePlayerName(this.state.players[i], "Player " + (i + 1))

    this.setState({ players: this.state.players.slice(), nextPlayer: this.nextPlayer })

    document.getElementById("Bet")?.focus()
  }

  changePlayerName(player, name, changeState = false) {
    this.log.push({ message: player.name + " has been renamed to " + player.setName(name) + ".", color: "white" })
    if (changeState) this.setState({ players: this.state.players.slice() })
  }

  guaranteeFirstPlayer() {
    for (let i = 0; i < this.state.players.length; i++) this.state.players[i].setActive(i === this.nextPlayer)
    this.setState({ players: this.state.players.slice() })
  }

  renderPlayers() {
    if (this.state.betDialogOn) return <div className="PlayerMenu">
        <b>{this.state.dealer.name}</b>
        <div style={this.margin()}>Hand:<br/>{this.state.dealer.getHand()?.map(card => 
          <label key={this.state.dealer.getHand().indexOf(card)}><img src={require("./Images/" + card.imageName())}
            alt={card.face() + " of " + card.suit()}/>&nbsp;</label>)}
        </div>
        <label className="prevent-select" onClick={() => {
          this.setState({ ...this.state, players: [...this.state.players, new Player("Player " + (this.state.players.length + 1))] })
          document.getElementById("Bet")?.focus()
        }}><b>+</b></label>
        {this.state.players.map(player =>
          <BetDialog player={player}
            onNameChange={name => this.changePlayerName(player, name, true)}
            onEnter={() => {
              if (!isNaN(player.bet) && Number(Number(player.bet).toFixed(2)) === Number(player.bet) 
                && Number(player.bet) > 0 && Number(player.bet) <= Number(player.score)) this.handleBet()
              }}
            onLeave={() => this.handleLeave()}
            onRemove={() => this.handleRemove(player)}
            guaranteeFirstPlayer={() => this.guaranteeFirstPlayer()}
            margin={this.margin()}
            key={this.state.players.indexOf(player)}/>)}
      </div>
    if (this.state.insuranceDialogOn) return <div className="PlayerMenu">
        {this.renderDealer()}
        {this.state.players.map(player =>
          <InsuranceDialog player={player}
            onNameChange={name => this.changePlayerName(player, name, true)}
            onYes={() => this.handleInsurance(true)} 
            onNo={() => this.handleInsurance(false)}
            margin={this.margin()}
            key={this.state.players.indexOf(player)}/>)}
      </div>
    return <div className="PlayerMenu">
        {this.renderDealer()}
        {this.state.players.map(player =>
          <ListedPlayer player={player}
            onNameChange={name => this.changePlayerName(player, name, true)}
            onHit={() => this.handleHit(player)}
            onStay={() => this.handleStay()}
            onDouble={() => this.handleDouble(player)}
            onSplit={() => this.handleSplit(player)}
            margin={this.margin()}
            key={this.state.players.indexOf(player)}/>)}
      </div>
  }

  render() {
    return <Columns listedPlayers={this.renderPlayers()} 
      log={this.renderLog()}
      players={this.state.players}
      dealer={this.state.dealer}
      bonusMultiplier={this.bonusMultiplier}/>
  }
}

export default PlayerMenu
