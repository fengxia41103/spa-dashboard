// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (

      <div className="myheader blue-grey darken-2">
        <video autoplay muted loop id="myVideo">
          <source src="downloads/lenovo%20the%20doer.mp4" type="video/mp4" />}
        </video>

        <div className="container text-right">
          <h1 className="myhighlight">
            Lenovo Open <i className="fa fa-mixcloud"></i> Cloud
          </h1>
          Platform Services
          <p className="myhighlight">
            Make . Platform . Better
          </p>
        </div>
      </div>
    );
  }
});

module.exports = Header;
