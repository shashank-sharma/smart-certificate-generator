import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './css/main.css';
import {Jumbotron} from 'react-bootstrap';
import Landing from './components/landing';
import axios from 'axios';
import {configureAnchors} from 'react-scrollable-anchor';
import ShopkeeperForm from './components/shopkeeperForm';

export default class Page extends Component {

    constructor() {
        super();
        this.state = {}
    };


    // handleChange(event) {
    //   const obj = {};
    //   obj['rsvpForm'] = {...this.state.rsvpForm}
    //   obj['rsvpForm'][event.target.name] = event.target.value;
    //   this.setState(obj);
    // };


    render() {
        return (
            <div>
                <ShopkeeperForm/>
            </div>
        )
    }
}
