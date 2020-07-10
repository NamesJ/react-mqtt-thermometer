import React from 'react';
import './App.css';
import { connect } from 'mqtt';


class Temperature extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: 0.0,
    }

    this.client = connect('mqtt://raspi3.local:9001', {
      //clientId: 'testnodejs',
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      connectTimeout: 1000,
      debug: true,
    })

    this.client.on('connect', () => {
      this.client.subscribe('/topic/temperature', (err) => {
        if (!err) {
          console.log('subscribed to /topic/temperature')
        } else {
          console.log('error')
        }
      })
    })

    this.client.on('message', (topic, message) => {
      this.setState({
        temperature: parseFloat(message.toString()),
      })
    })
  }

  render() {
    return (
      <p>
        {this.state.temperature} ℃
      </p>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Temperature />
      </header>
    </div>
  );
}



export default App;
