import React, { Component } from "react"
import './PlayerMenu.css'

class ListedPlayer extends Component {
    state = ({ firstColor: "white", secondColor: "white", nameSelected: false })

    handlePossibleEnter = (event, onBlur = false) => {
        if (event.key === "Enter" || onBlur) {
            if (event.target.value !== this.props.player.name) this.props.onNameChange(event.target.value)
            this.setState({ firstColor: "white", nameSelected: false })
            document.getElementById("Bet")?.focus()
        }
    }

    renderPlayerName() {
        if (this.state.nameSelected) return <input type="text"
            className="bold"
            style={{ WebkitTextFillColor: this.state.firstColor, color: this.state.firstColor }}
            size="10"
            defaultValue={this.props.player.name}
            autoFocus
            onFocus={(event) => event.target.select()}
            onBlur={(event) => this.handlePossibleEnter(event, true)}
            onKeyUp={this.handlePossibleEnter}
        />
        return <label className="bold"
                style={{ WebkitTextFillColor: this.state.firstColor, color: this.state.firstColor }}
                onClick={() => this.setState({ firstColor: "yellow", nameSelected: true })}>
            {this.props.player.name}
        </label>
    }

    renderHand() {
        return this.props.player.hands.map(hand => 
            <div style={this.props.margin} key={this.props.player.hands.indexOf(hand)}>
                Hand{this.props.player.getHandsAmount() > 1 ? " #" + (this.props.player.hands.indexOf(hand) + 1) : ""}:<br/>
                {hand.map(card => 
                    <label key={hand.indexOf(card)}><img src={require("./Images/" + card.imageName())}
                        alt={card.face() + " of " + card.suit()}/>&nbsp;</label>)}
            </div>)
    }

    render() {
        return <div className = "ListedPlayer">
                {this.renderPlayerName()}&nbsp;
                {this.props.player.isActive
                    ? <><label className="prevent-select" onClick={() => this.props.onHit()}> <b>Hit</b> </label>
                        <label className="prevent-select" onClick={() => this.props.onStay()}> <b>Stay</b> </label>
                        <label className="prevent-select" onClick={() => this.props.onDouble()}> <b>Double</b> </label>
                        {this.props.player.canSplitHand() 
                            ? <label className="prevent-select" onClick={() => this.props.onSplit()}> <b>Split</b> </label> 
                            : ""}</>
                    : ""}
                <div style={this.props.margin}>Bet: ${Number(this.props.player.bet).toFixed(2)}</div>
                {this.renderHand()}
            </div>
    }
}

export default ListedPlayer
