import React, {Component} from "react";
import Success from './success'
import axios from 'axios';
import '../css/versionBeta.css'

import panda_dark_base from '../img/panda_dark_base.png';
import panda_dark_header from '../img/panda_dark_header.png';
import panda_dark_footer from '../img/panda_dark_footer.png';

import panda_light_base from '../img/panda_light_base.png';
import panda_light_header from '../img/panda_light_header.png';
import panda_light_footer from '../img/panda_light_footer.png';

import pumpkin_base from '../img/pumpkin_base.png';
import pumpkin_header from '../img/pumpkin_header.png';
import pumpkin_footer from '../img/pumpkin_footer.png';

import buttercups_base from '../img/buttercups_base.png';
import buttercups_header from '../img/buttercups_header.png';
import buttercups_footer from '../img/buttercups_footer.png';
//import { url } from "inspector";


class ShopkeeperForm extends Component {
    state = {
        isRouted: false,
        shop_name: "",
        shop_type: "",
        theme: "light",
        isSubmitted: false,
        finalData: {
            'template_base': null,
            'template_nav': null,
            'template_footer': null,
            'shop_name': '',
            'shop_content': null
        }, // Remove final data and put image url or something
        isTemplateBase: true,
        isTemplateNav: false,
        isTemplateFooter: false,
        isTemplateInput: false,
    };

    handleImageChange = e => {
        const temp = e.target.name.split('_')[0];
        const allData = document.getElementsByClassName('template_' + temp);
        for (let i = 0; i < allData.length; i++) {
            allData[i].classList.remove('select-border');
        }

        document.getElementById(e.target.id).classList.add('select-border');
        const finalData = this.state.finalData;
        finalData['template_' + temp] = e.target.name;
        this.setState({
            "finalData": finalData,
            isTemplateFooter: true,
            isTemplateNav: false // image url to be set in state
        })
    };

    handleChange = e => {
        console.log('change', e.target.name, e.target.value);
        let finalData = this.state.finalData;
        finalData[e.target.name] = e.target.value;
        this.setState({
            'finalData': finalData
        });
    };

    handleTemplateBase = e => {
        this.setState({
            'isTemplateBase': true,
            'isTemplateNav': false,
            'isTemplateFooter': false,
            'isTemplateInput': false,
        })
    };

    handleTemplateNav = e => {
        this.setState({
            'isTemplateNav': true,
            'isTemplateBase': false,
            'isTemplateFooter': false,
            'isTemplateInput': false
        })
    };

    handleTemplateFooter = e => {
        this.setState({
            'isTemplateFooter': true,
            'isTemplateNav': false,
            'isTemplateBase': false,
            'isTemplateInput': false
        })
    };

    handleTemplateInput = e => {
        this.setState({
            'isTemplateInput': true,
            'isTemplateFooter': false,
            'isTemplateNav': false,
            'isTemplateBase': false,
        })
    }

    handleSubmit = () => {
        axios.post('/start', {
            token: localStorage.getItem('token'),
            data: this.state.finalData
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    

   

    render() {
        const styles={
            iconStyle: {
                opacity: 1.0,
            }
        }
        const { iconStyle } = styles;
        if (this.state.isSubmitted) {
            return (<Success/>);
        } else {
            let btn_dark = "";
            let btn_light = "";
            if (this.state.template === "dark") {
                btn_dark = "border-image";
                btn_light = "";
            } else if (this.state.template === "light") {
                btn_dark = "";
                btn_light = "border-image";
            }
            return (
                <React.Fragment>
                    {/*<div style={{height: "50px"}}></div>*/}
                    <div className={"white picker-background"}>
                        {this.state.isTemplateBase ? (
                        
                        <div className="bg">
                            {/**Clickable ( Upload image ) and select template here */}
                            <h1 onClick={this.handleTemplateNav}>Select Template</h1>

                        </div>
                        ) : (<div></div>)}

                        {this.state.isTemplateNav ? (
                            
                            <div className={"picker-row"}>
                            <img
                                name="base_panda_dark"
                                id={"base_panda_dark"}
                                className={"template_base"}
                                src={panda_dark_base}
                                alt="dark_theme"
                                onClick={this.handleImageChange}
                                style={{
                                    width: "auto",
                                    height: "60vh",
                                    marginBottom: "25vh",
                                    marginLeft: "100px",
                                    cursor: "pointer"
                                }}
                            />
                            <img
                                name="base_panda_light"
                                id={"base_light"}
                                className={"template_base"}
                                src={panda_light_base}
                                alt="dark_theme"
                                onClick={this.handleImageChange}
                                style={{
                                    width: "auto",
                                    height: "60vh",
                                    marginBottom: "25vh",
                                    marginLeft: "100px",
                                    cursor: "pointer"
                                }}
                            />
                            <img
                                name="base_pumpkin"
                                id={"base_pumpkin"}
                                className={"template_base"}
                                src={pumpkin_base}
                                alt="dark_theme"
                                onClick={this.handleImageChange}
                                style={{
                                    width: "auto",
                                    height: "60vh",
                                    marginBottom: "25vh",
                                    marginLeft: "100px",
                                    cursor: "pointer"
                                }}
                            />
                            <img
                                name="base_buttercups"
                                id={"base_buttercups"}
                                className={"template_base"}
                                src={buttercups_base}
                                alt="dark_theme"
                                onClick={this.handleImageChange}
                                style={{
                                    width: "auto",
                                    height: "60vh",
                                    marginBottom: "25vh",
                                    marginLeft: "100px",
                                    cursor: "pointer"
                                }}
                            />
                        </div> ): (<div></div>)}
                        {this.state.isTemplateFooter ? (
                           
                            <div>
                                
                            </div>

                        ) : (<div></div>)}
                        {this.state.isTemplateInput ? (
                            <div className={"container"} style={{marginTop: "50px"}}>
                                <input
                                    name="shop_name"
                                    className={"large-input"}
                                    placeholder="Shop Name"
                                    value={this.state.finalData.shop_name}
                                    onChange={this.handleChange}
                                />

                                <textarea
                                    name="shop_content"
                                    className={"large-input"}
                                    placeholder="Shop Content"
                                    value={this.state.finalData.shop_content}
                                    onChange={this.handleChange}
                                />

                                <button
                                    className="btn btn-large green darken-3"
                                    style={{marginBottom: "30px"}}
                                    onClick={this.handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        ) : (<div></div>)}
                    </div>
                    
                    <div className={"white picker-menu"}>
                        <div className={"row center"}>
                            <div className={"col l3"}>
                                <i className="large material-icons medium picker-icon" style={this.state.isTemplateBase?iconStyle:{opacity:'0.3'}} onClick={this.handleTemplateBase}>texture</i>
                            </div>
                            <div className={"col l3"}>
                                <i className="large material-icons medium picker-icon" style={this.state.isTemplateNav?iconStyle:{opacity:'0.3'}} onClick={this.handleTemplateNav}>web</i>
                            </div>
                            <div className={"col l3"}>
                                <i className="large material-icons medium picker-icon" style={this.state.isTemplateFooter?iconStyle:{opacity:'0.3'}} onClick={this.handleTemplateFooter}>video_label</i>
                            </div>
                            <div className={"col l3"}>
                                <i className="large material-icons medium picker-icon" style={this.state.isTemplateInput?iconStyle:{opacity:'0.3'}} onClick={this.handleTemplateInput}>toc</i>
                            </div>
                            
                        </div>
                    </div>
                </React.Fragment>
            );  
        }
        
    }
}



export default ShopkeeperForm;
