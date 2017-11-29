import React, {Component} from 'react';

class SingleCrypto extends Component {

  state = {value: 0}


  handleChange = (event) => {
    this.setState({value: event.target.value});
  }
  
  calculateProfit = () => {
    const originalPrice = this.state.value;
    const currentPrice = this.props.info.price;
    const profit = (currentPrice/originalPrice-1)*100;
    if(originalPrice){        
        // console.log("Or:",originalPrice,"Cur",currentPrice);
        console.log(profit+'%');
        return profit.toFixed(2);
    }
    else {
        // console.log('first time');
        return 0;
    }
  };

  render() {
    return (
      <div>
        <p>Name: {this.props.info.name}</p>
        <p>Price at time of purchase (USD): $
          <input type="number" value={this.state.value} onChange={this.handleChange} />
        </p>
        <p>Current Price: ${this.props.info.price}</p>
        <p>Percentage change: <span id='profit'>{this.calculateProfit()}%</span></p>
        <button onClick={(e) =>{this.props.deleteCrypto(this.props.info.name)}}>Remove</button>
      </div>
    );
  }
}

export default SingleCrypto;