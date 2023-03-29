import React from "react"
import ListedPlayer from "./ListedPlayer"
import './PlayerMenu.css'

class InsuranceDialog extends ListedPlayer {
    render() {
        if (this.props.player.isActive) return <div className = "InsuranceDialog">
                {this.renderPlayerName()}
                <br/>
                <label style={this.props.margin}>Buy insurance?</label>
                <label className="prevent-select" onClick={() => this.props.onYes()}> <b>Yes</b> </label>
                <label className="prevent-select" onClick={() => this.props.onNo()}> <b>No</b> </label>
                <div style={this.props.margin}>Bet: ${Number(this.props.player.bet).toFixed(2)}</div>
                {this.renderHand()}
            </div>
        return <div className = "InsuranceDialog">
                {this.renderPlayerName()}
                <div style={this.props.margin}>Bet: ${Number(this.props.player.bet).toFixed(2)}</div>
                {this.renderHand()}
            </div>
    }
}

export default InsuranceDialog
