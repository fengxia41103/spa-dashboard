import React from 'react';
import ProgressBox from "./progress.jsx";

var _ = require('lodash');

//****************************************
//
//    Common AJAX containers
//
//****************************************
var AjaxContainer = React.createClass({
  getInitialState: function() {
    return {
      loading: false
    }
  },
  getData: function() {
    if (this.state.loading) {
      return null;
    } else {
      this.setState({
        loading: true
      });
    }

    // Get data
    console.log("Getting: " + this.props.apiUrl);
    this.props.workHorse(this.props.apiUrl,
                         this.props.handleUpdate);
  },
  componentWillMount: function() {
    this.debounceGetData = _.debounce(function() {
      this.getData();
    }, 200);
  },
  render: function() {
    // Get data
    if (!this.state.loading && this.debounceGetData) {
      this.debounceGetData();
    }
    return (
      // Progress bar
      <ProgressBox />
    );
  }
});

module.exports = AjaxContainer;
