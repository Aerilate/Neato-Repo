import React, { Component } from 'react';
import axios from 'axios';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ file: event.target.files });
  }

  async handleSubmit(e) {
    e.preventDefault()
    await this.uploadFile();
  }

  async uploadFile() {
    let files = this.state.file;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`image[${i}]`, files[i])
    }

    axios.post('/api', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data)
    });
  }

  render() {
    return <div className="App">
      <header className="App-header">
        <form onSubmit={this.handleSubmit}>
          <input
            id="file"
            type="file"
            multiple name="file"
            onChange={this.handleChange}
          />
          <button type="submit">Upload file</button>
        </form>
      </header>
    </div>
  }
}

export default App;
