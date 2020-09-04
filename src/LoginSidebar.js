import React, { Component } from 'react';
import ReactSidebar from "react-sidebar";
import fire from './config/fire';
import './LoginSidebar.css';


class LoginSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    signup(e) {
        e.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
            console.log(u);
        }).catch((err) => {
            console.log(err);
        })
    }

    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
            console.log(u);
        }).catch((err) => {
            console.log(err);
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggleSidebar() {
        this.props.onToggledSidebar();
    }

    render() {
        return (
            <ReactSidebar
                sidebar={
                    <div className="Sidebar">
                        <h3 className="CloseButton" onClick={this.toggleSidebar}>close (x)</h3>
                        <h1 className="SidebarTitle">Signup / Login</h1>
                        <form>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="email"
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                            />
                            <div className="SignupLoginButtons">
                                <h2 className="SignupButton" onClick={this.signup}>signup</h2>
                                <h2 className="LoginButton" onClick={this.login}>login</h2>
                            </div>
                        </form>
                    </div>}
                pullRight={true}
                open={this.props.sidebarOpen}
                styles={{
                    sidebar:
                    {
                        background: "#333333",
                        color: "white"
                    }
                }}>
                <div />
            </ReactSidebar >
        );
    }
}


export default LoginSidebar;