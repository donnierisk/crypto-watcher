import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import Autosuggest from 'react-autosuggest';
import SingleCrypto from './SingleCrypto';

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

class App extends Component {
  
  state = {
      cryptoArray: [{
        name:'',
        price:0
      }],
      value: '',
      suggestions: [],
      cryptoOwned:[],
      currentInputVal:0
  }

  requestData () {
    axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=100')
    .then((response) =>{
      //console.log(response.data[0]);
      let cryptoArray = response.data.map((val,index)=>{
        return {name:val.name,price:val.price_usd}
      })

      //console.log(cryptoArray);
      this.setState({
        cryptoArray:cryptoArray,
        suggestions: cryptoArray,
      })

      //setTimeout(()=>{this.requestData()},300000);
    })
    .catch(function (error){
      console.log(error);
    })
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.cryptoArray.filter(coin =>
      coin.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  componentDidMount(){
    //Fetch all the Crypto information (top 100 currencies) from CoinMarketCap
      this.requestData();
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  addCrypto = () =>{
    const theVal = this.state.value;
    let duplicate = false;
    let isIn = this.state.cryptoArray.filter(e =>e.name === theVal);

    let theArray = this.state.cryptoOwned.slice();
    for(let i=0;i<theArray.length;i++){
      if(theArray[i].name === theVal){
        console.log('Crypto already added');
        duplicate = true;
        return false;
      }
    }

    if(isIn.length > 0 && duplicate === false){
      this.setState(prevState => ({
        cryptoOwned: [...prevState.cryptoOwned, {name: isIn[0].name, price: isIn[0].price}]
      }));
      console.log('crypto added');
    }
    else {
      console.log("Doesn't exist");
      return false;
    }
    
  }

  handleDeleteCrypto = (cryptoToRemove) => {

    this.setState((prevState) => ({
      cryptoOwned: prevState.cryptoOwned.filter((crypto) => cryptoToRemove !== crypto.name)
    }));
  }

  singleCrypto = (value,index) => {
    return <SingleCrypto info={value} key={index} deleteCrypto={this.handleDeleteCrypto}/>
  }

  render() {
    const { value, suggestions } = this.state;
    
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a cryptocurrency',
      value,
      onChange: this.onChange
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to your Personal Crypto Watcher</h1>
        </header>
        <div id='adder'>
            
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
            <button id='addCrypto' onClick={this.addCrypto}>+ Add CryptoCurrency</button>
          </div>
        <div id='coins-container'>
          {this.state.cryptoOwned.map((value,index)=> this.singleCrypto(value,index))}
        </div>
      </div>
    );
  }
}



export default App;
