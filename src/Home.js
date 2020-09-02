import React, { Component } from 'react';
import axios from 'axios';
import './Home.css';

const USER_ID = '12345678';
class Home extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            filesToUpload: null,
            displayImage: null,
            filesUploaded: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showImage = this.showImage.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    async getUploadedFiles() {
        let dbFiles = await axios.get(`/api/uploads?user=${encodeURIComponent(USER_ID)}`)
            .then((response) => {
                return response.data.contents;
            });

        if (this._isMounted) {
            this.setState({
                filesUploaded: dbFiles
            });
        }
    }

    async componentDidMount() {
        this._isMounted = true;

        // if (this.props.userId) {
        this.getUploadedFiles();
        // }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange(event) {
        this.setState({ filesToUpload: event.target.files });
    }

    async handleSubmit(e) {
        e.preventDefault()
        await this.uploadFile();
    }

    async uploadFile() {
        if (this.state.filesToUpload) {
            let files = this.state.filesToUpload;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`image[${i}]`, files[i])
            }

            axios.post(`/api/uploads?user=${encodeURIComponent(USER_ID)}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data)
                this.getUploadedFiles();
            });
        }
    }

    showImage(fileName) {
        axios.get(`/api/uploads/image?key=${encodeURIComponent(fileName)}`, { responseType: 'arraybuffer' })
            .then((response) => {
                let image = btoa(
                    new Uint8Array(response.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                this.setState({ displayImage: `data:${response.headers['content-type'].toLowerCase()};base64,${image}` });
            });
    }

    deleteFile(fileName) {
        axios.delete(`/api/uploads/image?key=${encodeURIComponent(fileName)}`).then(response => {
            console.log(response.data)
            this.getUploadedFiles();
        });
    }

    formatUploadedFiles(arr) {
        this.state.filesUploaded.forEach((f) => {
            arr.push(
                <div className="File" key={f.Key}>
                    <p>{f.Key.substring(f.Key.indexOf('-') + 1)}</p>
                    <p onClick={() => { this.showImage(f.Key) }}> show </p>
                    <p onClick={() => { this.deleteFile(f.Key) }}> delete </p>
                </div>)
        });
    }

    render() {
        let displayUploadedFiles = []
        this.formatUploadedFiles(displayUploadedFiles);

        return <div className="Home">
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

            <div>
                {displayUploadedFiles}
            </div>
        </div>
    }
}

export default Home;
