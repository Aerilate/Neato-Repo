import React, { Component } from 'react';
import axios from 'axios';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filesToUpload: null,
      displayImage: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showImage = this.showImage.bind(this);
  }

  handleChange(event) {
    this.setState({ filesToUpload: event.target.files });
  }

  async handleSubmit(e) {
    e.preventDefault()
    await this.uploadFile();
  }

  async uploadFile() {
    let files = this.state.filesToUpload;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`image[${i}]`, files[i])
    }

    axios.post('/api/uploads', formData, {
      headers: {
        'userid': '12345678',
        'content-type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data)
    });
  }

  showImage() {
    axios.get('/api/uploads/image', { responseType: 'arraybuffer' })
      .then((response) => {
        let image = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        this.setState({displayImage: `data:${response.headers['content-type'].toLowerCase()};base64,${image}`});
      });
  }

  render() {
    return <div className="App">
      <header className="App-header">
        {this.state.displayImage ? <img src={this.state.displayImage} alt="displayImage" /> : null}
        <form onSubmit={this.handleSubmit}>
          <input
            id="file"
            type="file"
            multiple name="file"
            onChange={this.handleChange}
          />
          <button type="submit">Upload file(s)</button>
        </form>
        <button onClick={this.showImage}> show </button>
      </header>
    </div>
  }
}

export default App;
