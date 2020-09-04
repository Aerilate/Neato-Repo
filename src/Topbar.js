import React, { Component } from 'react';
import fire from './config/fire';
import './Topbar.css';


class Topbar extends Component {
    constructor(props) {
        super(props);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.createTask = this.createTask.bind(this);
        this.clearBoard = this.clearBoard.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleSidebar() {
        this.props.onToggledSidebar();
    }
    
    createTask() {
        this.props.onCreateTask();
    }

    clearBoard() {
        this.props.onClearBoard();
    }

    handleLogout() {
        fire.auth().signOut();
    }

    render() {
        return (
            <div className="Topbar">
                <nav>
                    <ul>
                        <li className="Title"><h2>kanbanner</h2></li>

                        {this.props.page === "Home" &&
                            <li className="Login" onClick={this.toggleSidebar}><h2>signup / login</h2></li>}

                        {this.props.page === "Board" &&
                            <div>
                                <li className="CreateTask" onClick={this.createTask}><h2>create task</h2></li>
                                <li className="ClearBoard" onClick={this.clearBoard}><h2>clear board</h2></li>
                                <li className="Logout" onClick={this.handleLogout}><h2>logout</h2></li>
                            </div>}
                    </ul>
                </nav>
            </div>
        )
    }
}


export default Topbar;