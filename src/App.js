import React, { Component } from 'react';
import fire from './config/fire';
import Dashboard from './Dashboard'
import Home from './Home';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    })
  }

  render() {
    return (
      <div className="Page">
        {this.state.user ? <Dashboard userID={this.state.user.uid} /> : <Home />}
      </div>
    );
  }
}


export default App;