import React from "react"
import ListedPlayer from "./ListedPlayer"
import './BetDialog.css'

class BetDialog extends ListedPlayer {
    componentDidMount() {
        this.props.guaranteeFirstPlayer()
        this.props.player.bet = 0
    }

    handleKeyPressed = (event) => {
        this.props.player.bet = Number(event.target.value)
        if (event.key === "Enter") this.props.onEnter()
    }

    render() {
        return <div className = "BetDialog">
                {this.props.player.isActive
                    ? <label className="prevent-select" onClick={() => this.props.onLeave()}> <b>-</b> </label>
                    : <label className="prevent-select" onClick={() => this.props.onRemove()}> <b>-</b> </label>}
                {this.renderPlayerName()}
                {this.props.player.isActive
                    ? <div style={this.props.margin}>Bet: $<input id="Bet"
                        type="text"
                        style={{ WebkitTextFillColor: this.state.secondColor, color: this.state.secondColor }}
                        size="10"
                        autoFocus
                        onFocus={(event) => this.setState({ secondColor: "yellow" }, () => event.target.select())}
                        onBlur={() => this.setState({ secondColor: "white" })}
                        onKeyUp={this.handleKeyPressed}/>
                    </div>
                    : <div style={this.props.margin}>Bet: ${Number(this.props.player.bet).toFixed(2)}</div>}
                {this.renderHand()}
            </div>
    }
}

export default BetDialog
