import React, { Component } from 'react';
import fire from './config/fire';
import './Topbar.css';


class Topbar extends Component {
    constructor(props) {
        super(props);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleSidebar() {
        this.props.onToggledSidebar();
    }

    handleLogout() {
        fire.auth().signOut();
    }

    render() {
        return (
            <div className="Topbar">
                <nav>
                    <ul id="TopbarOptions">
                        <li id="Title"><h2>neato repo</h2></li>

                        {this.props.page === "Home" &&
                            <li className="Login" onClick={this.toggleSidebar}><h2>signup / login</h2></li>}

                        {this.props.page === "Dashboard" &&
                            <li className="Logout" onClick={this.handleLogout}><h2>logout</h2></li>}
                    </ul>
                </nav>
            </div>
        )
    }
}


export default Topbar;