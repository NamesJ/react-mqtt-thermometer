import React from 'react';
import './App.css';
import { connect } from 'mqtt';


class MqttClient {
  constructor(url, topic, onMessage) {
    this.client = connect(url, {
      //clientId: 'testnodejs',
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      connectTimeout: 1000,
      debug: true,
    })
    this.client.on('connect', () => {
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log('subscribed to ' + topic)
        } else {
          console.log('error')
        }
      })
    })
    this.client.on('message', onMessage)
  }
}



class App extends React.Component {
  constructor(props) {
    super(props)

    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleBrokerUrlChange = this.handleBrokerUrlChange.bind(this)
    this.mqttConnect = this.mqttConnect.bind(this)
    this.onMqttMessage = this.onMqttMessage.bind(this)

    this.client = null

    this.state = {
      broker_url: 'mqtt://192.168.1.102:9001',
      topic: '/temperature-01',
      temperature: 0,
    }
  }

  handleTopicChange(e) {
    this.setState({ topic: e.target.value })
  }

  handleBrokerUrlChange(e) {
    this.setState({ broker_url: e.target.value })
  }

  mqttConnect(e) {
    if (this.client != null) { this.client.end() }

    this.client = new MqttClient(
        this.state.broker_url,
        this.state.topic,
        this.onMqttMessage )

    e.preventDefault()
  }

  onMqttMessage(topic, message) {
    this.setState({
      temperature: parseFloat(message.toString()),
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <p>
            {this.state.temperature} ℃
          </p>
        </div>
        <form className="App-form" onSubmit={this.mqttConnect}>
          <input className="App-broker-url" type="text" name="broker_url" placeholder="broker url" value={this.state.broker_url} onChange={this.handleBrokerUrlChange} />
          <input className="App-mqtt-topic" type="text" name="mqtt_topic" placeholder="mqtt topic" value={this.state.topic} onChange={this.handleTopicChange} />
          <input className="App-submit" type="submit" value="Connect" />
        </form>
      </div>
    );
  }
}



export default App;
