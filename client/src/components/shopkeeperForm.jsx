import React, { Component } from "react";
import Success from "./success";
import axios from "axios";
import "../css/versionBeta.css";
import { Document, Page } from 'react-pdf';


import panda_dark_base from "../img/panda_dark_base.png";
import panda_dark_header from "../img/panda_dark_header.png";
import panda_dark_footer from "../img/panda_dark_footer.png";

import panda_light_base from "../img/panda_light_base.png";
import panda_light_header from "../img/panda_light_header.png";
import panda_light_footer from "../img/panda_light_footer.png";

import pumpkin_base from "../img/pumpkin_base.png";
import pumpkin_header from "../img/pumpkin_header.png";
import pumpkin_footer from "../img/pumpkin_footer.png";

import buttercups_base from "../img/buttercups_base.png";
import buttercups_header from "../img/buttercups_header.png";
import buttercups_footer from "../img/buttercups_footer.png";
//import { url } from "inspector";

import M from "materialize-css";
//import {Container,Row,Col} from 'reactstrap';
import "../css/xray.css";

const url = "http://www.africau.edu/images/default/sample.pdf"

class ShopkeeperForm extends Component {
  state = {
    isRouted: false,
    shop_name: "",
    shop_type: "",
    theme: "light",
    isSubmitted: false,
    finalData: {
      event_name: "",
      name: ""
    }, // Remove final data and put image url or something
    isTemplateBase: true,
    isTemplateNav: false,
    isTemplateFooter: false,
    isTemplateInput: false,
    formData: null,
    file: null,
    loading: false,
    numPages: null,
    pageNumber: 1,
  };

  componentDidMount() {
    fetch("http://3880832e.ngrok.io/ping ")
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }

  handleImageChange = e => {
    const temp = e.target.name.split("_")[0];
    const allData = document.getElementsByClassName("template_" + temp);
    for (let i = 0; i < allData.length; i++) {
      allData[i].classList.remove("select-border");
    }

    document.getElementById(e.target.id).classList.add("select-border");
    const finalData = this.state.finalData;
    finalData["template_" + temp] = e.target.name;
    this.setState({
      finalData: finalData
      // image url to be set in state
    });
  };

  handleChange = e => {
    console.log("change", e.target.name, e.target.value);
    let finalData = this.state.finalData;
    finalData[e.target.name] = e.target.value;
    this.setState({
      finalData: finalData
    });
  };

  handleTemplateBase = e => {
    this.setState({
      isTemplateBase: true,
      isTemplateNav: false,
      isTemplateFooter: false,
      isTemplateInput: false
    });
  };

  handleTemplateNav = e => {
    this.setState({
      isTemplateNav: true,
      isTemplateBase: false,
      isTemplateFooter: false,
      isTemplateInput: false
    });
  };

  handleTemplateFooter = e => {
    this.setState({
      isTemplateFooter: true,
      isTemplateNav: false,
      isTemplateBase: false,
      isTemplateInput: false
    });
  };

  handleTemplateInput = e => {
    this.setState({
      isTemplateInput: true,
      isTemplateFooter: false,
      isTemplateNav: false,
      isTemplateBase: false
    });
  };

  handleSubmit = () => {
    axios
      .post("/start", {
        token: localStorage.getItem("token"),
        data: this.state.finalData
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleFileChange = e => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    this.setState({
      formData: formData
    });
    this.setState({
      file: URL.createObjectURL(file)
    });
    M.toast({ html: "Template Selected" });
    setTimeout(() => {
      this.handleTemplateFooter();
    }, 1000);
    //console.log(file)
  };

  uploadFile = formData => {
    axios
      .post("http://127.0.0.1:5000/create_test_template", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleDataSubmit = () => {
    this.setState({
      isTemplateInput: true,
      isTemplateFooter: false,
      isTemplateNav: false,
      isTemplateBase: false,
      loading: true
    });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 14000);
  };

  onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({ numPages })
  }

  render() {
    const styles = {
      iconStyle: {
        opacity: 1.0
      }
    };

    const { pageNumber, numPages } = this.state;

    const { iconStyle } = styles;
    if (this.state.isSubmitted) {
      return <Success />;
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
      if (this.state.loading) {
        return (
          <div className="container" style={{ marginTop: "150px" }}>
            <div className="row">
              <div className="col s12 m6 l6">
                <div className="outclass">
                  <div className="scene">
                    <div className="scene__slide scene__slide_first">
                      <img className={"xray-image"} src={this.state.file}></img>
                    </div>
                    <div className="scene__slide scene__slide_second">
                      <img
                        className="xray-image invertimage"
                        src={this.state.file}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col s12 m6 l6">
                  
                  <h1 className="header center textFormat white-text">Creating your awesome certificate...</h1>
              </div>
            </div>
          </div>
          
        );
      } else {
        return (
          <React.Fragment>
            {/*<div style={{height: "50px"}}></div>*/}
            <div className={"white picker-background"}>
              {this.state.isTemplateBase ? (
                <div className="bg">
                  {/**Clickable ( Upload image ) and select template here */}

                  {/*<div className="">*/}
                  {/*<span>File</span>*/}
                  {/*<i className="large material-icons medium picker-icon black-text"> </i>*/}
                  {/*<input type="file" />*/}
                  {/*</div>*/}

                  {/*<input type="file" onChange={this.handleFileChange} /> */}
                  <div className="row">
                    <div
                      className="col s12 m5 l5 offset-m1 offset-l1"
                      style={{ marginTop: "325px" }}
                    >
                      <div>
                        <form>
                          <div class="file-field input-field">
                            <div class="btn green darken-1">
                              <span>File</span>
                              <input
                                type="file"
                                onChange={this.handleFileChange}
                              />
                            </div>
                            <div class="file-path-wrapper">
                              <input class="file-path validate" type="text" />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col s12 m6 l6">
                      <h1
                        className="black-text"
                        onClick={this.handleTemplateNav}
                      >
                        Select Template
                      </h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

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
                </div>
              ) : (
                <div></div>
              )}
              {this.state.isTemplateFooter ? (
                <div className="container" style={{ marginTop: "200px" }}>
                  <input
                    name="event_name"
                    className={"large-input"}
                    placeholder="Event Name"
                    value={this.state.finalData.event_name}
                    onChange={this.handleChange}
                  />
                  <input
                    name="name"
                    className={"large-input"}
                    placeholder="Name"
                    value={this.state.finalData.name}
                    onChange={this.handleChange}
                  />
                  <div className="center">
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-large green darken-1"
                      disabled={this.state.loading}
                      onClick={this.handleDataSubmit}
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              {this.state.isTemplateInput ? (
                <div className={"row"} style={{ marginTop: "50px" }}>
                  <div className={"col s12 m6 l6"}>
                    {/**Button to download */}
                  </div>
                  <div className={"col s12 m6 l6"}>
                    {/**PDF view here */}
                    <Document
                        file={url}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                        <Page pageNumber={1}/>
                    </Document>
                    {/*<p>Page { pageNumber } of { numPages }</p>*/}
                  </div>

                  <a className="btn-floating btn-large waves-effect waves-light red start-public">
                    <i
                      className="material-icons large"
                      id={"menu"}
                      onClick={this.handleSubmit}
                    >
                      public
                    </i>
                  </a>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className={"white picker-menu"}>
              <div className={"row center"}>
                <div className={"col l3"}>
                  <i
                    className="large material-icons medium picker-icon"
                    style={
                      this.state.isTemplateBase ? iconStyle : { opacity: "0.3" }
                    }
                    onClick={this.handleTemplateBase}
                  >
                    texture
                  </i>
                </div>
                <div className={"col l3"}>
                  <i
                    className="large material-icons medium picker-icon"
                    style={
                      this.state.isTemplateNav ? iconStyle : { opacity: "0.3" }
                    }
                    onClick={this.handleTemplateNav}
                  >
                    web
                  </i>
                </div>
                <div className={"col l3"}>
                  <i
                    className="large material-icons medium picker-icon"
                    style={
                      this.state.isTemplateFooter
                        ? iconStyle
                        : { opacity: "0.3" }
                    }
                    onClick={this.handleTemplateFooter}
                  >
                    video_label
                  </i>
                </div>
                <div className={"col l3"}>
                  <i
                    className="large material-icons medium picker-icon"
                    style={
                      this.state.isTemplateInput
                        ? iconStyle
                        : { opacity: "0.3" }
                    }
                    onClick={this.handleTemplateInput}
                  >
                    toc
                  </i>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

export default ShopkeeperForm;
