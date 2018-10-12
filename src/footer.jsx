// footer.js
import React from "react";


var Footer = React.createClass({
  render () {
    return (
      <footer className="page-footer blue-grey darken-2">
        <div className="footer-copyright">
          <div className="container">
            <i className="fa fa-copyright"></i>2018 PY Consulting Ltd.
            <span className="grey-text text-lighten-4 right">
              Made by <a href="http://www.lenovo.com">Lenovo Open Cloud Team</a> @
              <a href="http://hpcgitlab.labs.lenovo.com/IBB/rhhi/tree/master/dashboard/src">source</a>
            </span>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
