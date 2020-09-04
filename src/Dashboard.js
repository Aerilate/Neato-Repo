import React, { Component } from 'react';
import Topbar from './Topbar';
import axios from 'axios';
import './Dashboard.css';


class Dashboard extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            filesToUpload: null,
            displayImage: null,
            personalFiles: [],
            publicFiles: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showImage = this.showImage.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }


    async componentDidMount() {
        this._isMounted = true;

        if (this.props.userID) {
            this.getUpdatedFiles()
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.userID && prevProps.userID !== this.props.userID) {
            this.getUpdatedFiles()
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

            axios.post(`/api/uploads?user=${encodeURIComponent(this.props.userID)}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }).then(() => {
                this.getUpdatedFiles()
            });
        }
    }

    async getPersonalFiles() {
        let dbFiles = await axios.get(`/api/uploads/users/${encodeURIComponent(this.props.userID)}`)
            .then((response) => {
                return response.data;
            });

        if (this._isMounted) {
            this.setState({
                personalFiles: dbFiles
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
                publicFiles: dbFiles
            });
        }
    }

    async getUpdatedFiles() {
        this.getPersonalFiles();
        this.getPublicFiles();
    }

    showImage(fileName) {
        axios.get(`/api/uploads?key=${encodeURIComponent(fileName)}`, { responseType: 'arraybuffer' })
            .then((response) => {
                let image = btoa(
                    new Uint8Array(response.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                this.setState({ displayImage: `data:${response.headers['content-type'].toLowerCase()};base64,${image}` });
            });
    }

    updateFilePermission(fileName, bool) {
        const payload = { permission: bool};
        axios.patch(`/api/uploads?key=${encodeURIComponent(fileName)}`, payload)
            .then(() => {
                this.getUpdatedFiles()
            });
    }
  
    deleteFile(fileName) {
        axios.delete(`/api/uploads?key=${encodeURIComponent(fileName)}`)
            .then(() => {
                this.getUpdatedFiles()
            });
    }



    formatUploadedFiles(stateArr, arr) {
        stateArr.forEach((f) => {
            arr.push(
                <li className="File" key={f.key}>
                    <h3>{f.key.substring(f.key.indexOf('-') + 1)}</h3>

                    <p onClick={() => { this.showImage(f.key) }}> show </p>
                    {this.props.userID === f.user
                        ? <div>
                            <p onClick={() => { this.updateFilePermission(f.key, true) }}> public </p>
                            <p onClick={() => { this.updateFilePermission(f.key, false) }}> private </p>
                            <p onClick={() => { this.deleteFile(f.key) }}> delete </p>
                        </div>
                        : null}
                </li>)
        });
    }

    render() {
        let displayPersonalFiles = [];
        this.formatUploadedFiles(this.state.personalFiles, displayPersonalFiles);

        let displayPublicFiles = [];
        this.formatUploadedFiles(this.state.publicFiles, displayPublicFiles);

        return <div className="Dashboard">
            <Topbar page="Dashboard" />

            {this.state.displayImage ? <img src={this.state.displayImage} alt="displayImage" /> : null}

            <div id="Upload">
                <form onSubmit={this.handleSubmit}>
                    <input
                        id="file"
                        type="file"
                        multiple name="file"
                        onChange={this.handleChange}
                    />
                    <button type="submit">Upload file(s)</button>
                </form>
            </div>

            <div id='Table'>
                <div className='Column'>
                    <h2>Personal Images</h2>
                    <ul>
                        {displayPersonalFiles}
                    </ul>
                </div>

                <div className='Column'>
                    <h2>Public Images</h2>
                    <ul>
                        {displayPublicFiles}
                    </ul>
                </div>
            </div>
        </div>
    }
}


export default Dashboard;