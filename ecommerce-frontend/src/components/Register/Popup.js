import react from 'react'


class Popup extends react.Component{
    constructor()
    {
        super()
        this.state = {
            trigger : false
        }

        this.UpdateState = this.UpdateState.bind(this)
        this.sendData = this.sendData.bind(this)
    }
    
    render(){ 
        return this.props.trigger ? (
        <div className="popup">
            <div className="popup-content">
                <div className="close-popup"><button className="popup-close-btn" onClick={this.UpdateState}>&times;</button></div>
                <h3>Passwords must match!</h3>
            </div>
        </div>
    ) : "";
    }

    sendData = () => {
        this.props.parentCallBack(this.state.trigger)
    }
    
    UpdateState(){
        console.log("update state")
        this.setState({
            trigger : false
        });
        this.sendData()
    }

   com
}

export default Popup