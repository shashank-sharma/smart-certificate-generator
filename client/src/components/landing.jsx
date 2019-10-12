import React, { Component } from 'react'
import '../css/style.css'
import M from 'materialize-css';
import ShopkeeperForm from './shopkeeperForm'
import axios from "axios/index";

class Landing extends Component {
    state = { 
        isRouted: true,
        isToken: false,
    };

    getGreetings = () => {
        // axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/greetings`)
        axios.get(`/users/ping`)
            .then((res) => {
                console.log(res);
                // this.setState({greetings: res.data.data.greetings});
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        M.AutoInit();
        this.getGreetings();
    }

    changeRoute = () =>{
        this.setState({isRouted:false})
    };
    render() { 
        if(this.state.isRouted){
            return (
              <React.Fragment>
                <h1 className="white-text customHeader">"Some Quote"</h1>
                <div style={{ textAlign: "center" }}>
                        <button
                            className="btn btn-large z-depth-0 customButton white-text"
                            onClick={this.changeRoute}
                        >
                            Continue
                        </button>
                </div>
              </React.Fragment>
            );
        }else{
            return <ShopkeeperForm/>
        }
       
    }
}
 
export default Landing