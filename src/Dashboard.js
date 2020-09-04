import React, { Component } from 'react';
import axios from 'axios';
import './Dashboard.css';


class Home extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            filesToUpload: null,
            displayImage: null,
            filesUploaded: [],
            filesPublic: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showImage = this.showImage.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    async getUploadedFiles() {
        let dbFiles = await axios.get(`/api/uploads?user=${encodeURIComponent(this.props.userId)}`)
            .then((response) => {
                return response.data;
            });

        if (this._isMounted) {
            this.setState({
                filesUploaded: dbFiles
            });
        }
    }

    async getPublicFiles() {
        let dbFiles = await axios.get('/api/uploads/public')
            .then((response) => {
                return response.data;
            });

        if (this._isMounted) {
            this.setState({
                filesPublic: dbFiles
            });
        }
    }

    async componentDidMount() {
        this._isMounted = true;

        if (this.props.userId) {
            this.getUploadedFiles();
            this.getPublicFiles();
        }
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

            axios.post(`/api/uploads?user=${encodeURIComponent(this.props.userId)}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data)
                this.getUploadedFiles();
                this.getPublicFiles();
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
            this.getPublicFiles();
        });
    }

    updateImagePermission(fileName, bool) {
        axios.patch(`/api/uploads/image?key=${encodeURIComponent(fileName)}&access=${bool}`)
            .then((response) => {
                console.log(response.data)
                this.getUploadedFiles();
                this.getPublicFiles();
            });
    }

    formatUploadedFiles(stateArr, arr) {
        stateArr.forEach((f) => {
            arr.push(
                <div className="File" key={f.key}>
                    <p>{f.key.substring(f.key.indexOf('-') + 1)}</p>
                    <p onClick={() => { this.updateImagePermission(f.key, true) }}> public </p>
                    <p onClick={() => { this.updateImagePermission(f.key, false) }}> private </p>
                    <p onClick={() => { this.showImage(f.key) }}> show </p>
                    <p onClick={() => { this.deleteFile(f.key) }}> delete </p>
                </div>)
        });
    }

    render() {
        let displayUploadedFiles = [];
        this.formatUploadedFiles(this.state.filesUploaded, displayUploadedFiles);

        let displayPublicFiles = [];
        this.formatUploadedFiles(this.state.filesPublic, displayPublicFiles);

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
                {displayPublicFiles}
            </div>
        </div>
    }
}

export default Home;
