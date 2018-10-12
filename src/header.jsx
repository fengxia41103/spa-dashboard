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


          <div className="pin-card myhighlight">
            <p>
              This is a project I worked on in Oct. 2018. Since deployment
              is driven by a list of YAML files as config values, the idea
              emerged to build a (live) dashboard for each environment
              using these YAML files as data source. Thus, the dashboard
              will always be consistend with deployment configuration.
            </p>

            <p>
              In this demo, I have included example YAML in a local
              folder <code>/downloads/example</code>. They can also be
              fetched from a remote server since retrieval is using <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"><code>fetch&nbsp;</code></a>
               API. Configurations and values are examplary. With this
              framework in place, it can render any type of data
              source in the same fashion to achieve what you are
              looking at right now.
            </p>

            <p>
              Enjoy, and <a href="mailto:feng_xia41103@hotmail.com">contact me&nbsp;</a>
              if you'd like to know more.
            </p>
          </div>
        </div>

      </div>
    );
}
});

module.exports = Header;
