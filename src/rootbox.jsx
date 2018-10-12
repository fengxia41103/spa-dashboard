import React from 'react';
import ReactDOM from 'react-dom';
import Highlight from 'react-highlight'
import yaml from 'js-yaml'
import AjaxYamlContainer from './ajax_yaml.jsx';

var _ = require('lodash');

var randomId = function() {
  return "feng" + (Math.random() * 1e32).toString(12);
};

var VMConfig = React.createClass({
  render: function(){
    var divStyle = {
      borderBottom:"1px dashed #d52349"
    };
    var mapping = this.props.config_mapping;
    var config = this.props.config;
    var vm_settings = [];
    _.forEach(mapping, function(val, key){
      var setting = null;
      if (_.isArray(val)){
        setting = _.join(val.map(function(x){
          return _.toString(config[x]);
        }), "/");
      }else{
        setting = config[val];
      }
      if (!_.isNull(setting) && !_.isUndefined(setting)){
        vm_settings.push((
          [<label className="col l3 m6 s6 right-align">
            { key }:
          </label>,
          <span className="col l3 m6 s6" style={divStyle}>
            { setting }
          </span>]
        ));
      }
    });


    var config = this.props.config;
    return (
      <div className="row">
        { vm_settings }
      </div>
    )
  }
});


var VMNetwork = React.createClass({
  render: function(){
    var nic_config = _.cloneDeep(this.props.nic_config);
    var network_config = _.cloneDeep(this.props.network_config);

    // NIC <-> network name is 1:1 mapping,
    // eg. NIC1 -> eth0, NIC2 -> eth1, and so on.
    _.forEach(nic_config, function(nic,index){
      _.merge(nic, network_config[index]);
    });


    var networks = null;
    if (_.isArray(nic_config)){
      networks = nic_config.map(function(n){
        return (
          <tr><td>
            { n.nic_name }
          </td><td>
            { n.nic_ip_address }
          </td><td>
            { n.nic_netmask }
          </td><td>
            { n.nic_gateway }
          </td><td>
            { n.name }
          </td><td>
            { n.profile_name }
          </td><td>
            { n.network_name }
          </td></tr>
        )
      });
    }

    return (
      <table className="table striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>IP Address</th>
            <th>Mask</th>
            <th>Gateway</th>
            <th>Virtual NIC</th>
            <th>Platform Network Profile</th>
            <th>Platform Network</th>
          </tr>
        </thead>
        <tbody>
          { networks }
        </tbody>
      </table>
    )
  }
});

var ServiceList = React.createClass({
  getInitialState: function(){
    return {
      common_configs:{
        "VM Name": "vm_name",
        "Host Name": "host_name",
        "VM Management": ["vm_user", "vm_root_password"],
        "QCOW Name": "qcow_name",
        "QCOW Source": "qcow_name",
        "QCOW Size": "upload_qcow_size",
        "QCOW Upload to": "qcow_upload_domain",
        "CPU Cores": "cpu_cors",
        "Memory": "memory",
        "Storage Domain VM": "storage_domain_vm",
        "Storage Domain Disk": "storage_domain_disk"
      },
      services: [{
        name: "Satellite",
        config_url:"example/satellite/",
        config_filename: "example_vm_vars.yml"
      },{
        name: "Ansible Tower",
        config_url:"example/ansible_tower/",
        config_filename: "example_vm_vars.yml",
        config_mapping: {
          "Installation Source": "AT_setup",
          "Version": "AT_latest_version",
          "Admin Password": "AT_admin_password",
          "2nd Disk": "disk2_name",
          "2nd Disk Size": "disk2_size",
          "Database": "pg_database",
          "DB Management": ["pg_username", "pg_password"]
        }
      },{
        name: "Discovery",
        config_url:"example/discovery/",
        config_filename: "example_vm_vars.yml",
        config_mapping: {
          "Installation Source": "lenovo_hpc",
          "TTY User": ["confetty_user", "confetty_password"]
        }
      },{
        name: "Ceh Dashboard",
        config_url:"example/dashboard/",
        config_filename: "example_vm_vars.yml"
      },{
        name: "LXCA",
        config_url:"example/lxca/",
        config_filename: "example_vm_vars.yml",
        config_mapping: {
          "IP": "ipv4_addr"
        }
      },{
        name: "Inventory (netbox)",
        config_url:"example/netbox/",
        config_filename: "example_vm_vars.yml"
      }]
    }
  },
  render: function(){
    var common = this.state.common_configs;
    var props = this.props;
    var services = this.state.services.map(function(s){
      var mapping = _.merge(s.config_mapping, common);
      return (
        <ServiceBox service={s.name}
                    args={s}
                    config_mapping={mapping}
                    {...props}/>
      )
    });

    return (
      <div>
        { services }
      </div>
    );
  }
});

var ServiceBox = React.createClass({
  getInitialState: function() {
    return {
      config: null
    }

  },
  getUrl: function(config_server,path, yaml_file) {
    // Build API url
    return config_server+path+yaml_file;
  },
  handleUpdate: function(data){
    this.setState({
      config: yaml.load(data),
    });
  },
  render: function(){
    // get config
    if (this.state.config === null) {

      var api = this.getUrl(this.props.config_server,
                            this.props.args.config_url,
                            this.props.args.config_filename);

      return (
        <AjaxYamlContainer apiUrl={api} handleUpdate={this.handleUpdate} />
      );
    }

    return (
      <div>
        <h5 className="my-section-header">
           {this.props.service }
        </h5>

        <h6>VM Basics</h6>
        <VMConfig config={this.state.config}
                  config_mapping={this.props.config_mapping} />

        <h6>Networks</h6>
        <VMNetwork nic_config={this.state.config.cloud_init_nics}
                   network_config={this.state.config.nics} />
      </div>
    )
  }
});

var RaidConfig = React.createClass({
  render: function(){
    var config = this.props.config;
    var raids = [];
    _.forEach(config, function(val, key) {
      if (_.has(val, "raid_type")) {
        var disks = _.map(val.disk_list, function(d){
          return (
            <span className="badge green">{d}</span>
          )
        });
        var tmp = (
          <tr><td>
            { key }
          </td><td>
          { val.raid_type }
          </td><td>
          { val.controller }
          </td><td>
          { disks }
          </td></tr>
        );
        raids.push(tmp);
      }
    });

    return (
      <table className="table striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>RAID Type</th>
            <th>RAID Controller</th>
            <th>Disk List</th>
          </tr>
        </thead>

        <tbody>
          { raids }
        </tbody>
      </table>
    );
  }
});

var RaidCachePolicy = React.createClass({
  render: function(){
    var writepolicy = {
      0: "write through",
      1: "always write back",
      2: "write with BBU"
    };
    var readpolicy = {
      0: "no read ahead",
      1: "read ahead",
      2: "adaptive read ahead"
    }
    var write = writepolicy[this.props.config["writepolicy"]];
    var read = readpolicy[this.props.config["readpolicy"]];

    return (

      <table className="table striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Setting</th>
          </tr>
        </thead>

        <tbody>
          <tr><td>
            Write
          </td><td>
            { write }
          </td></tr>

          <tr><td>
            Read
          </td><td>
            { read }
          </td></tr>
        </tbody>
      </table>

    );
  }
});

var Networks = React.createClass({
  render: function(){
    var nets = this.props.config["networks"].map(function(n){
      return (
        <tr><td>
        { n.name }
        </td><td>
        { n.vlan }
        </td><td>
        {n.interface}
        </td></tr>
      );
    });

    return (
      <table className="table striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>VLAN</th>
            <th>Server Interface</th>
          </tr>
        </thead>
        <tbody>
          { nets }
        </tbody>
      </table>
    );
  }
});

var Servers = React.createClass({
  render: function(){
    var user = this.props.config["imm_user"];
    var pwd = this.props.config["imm_password"];
    var imms = this.props.config["imm_ips"].map(function(ip){
      return (
        <tr><td>
          {ip}
        </td><td>
          {user}
        </td><td>
          {pwd}
        </td></tr>
      )
    });

    return (
      <table className="table striped">
        <thead>
          <tr>
            <th>IP</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {imms}
        </tbody>
      </table>
    );
  }

});

var BootstrapServices = React.createClass({
  getServices: function(){
    var configs = this.props.config;
    var services = new Object();

    services["lxca"] = new Object();
    services["lxca"]["name"]= "LXCA";
    services["lxca"]["url"] = configs["lxca_url"];
    services["lxca"]["username"] = configs["lxca_user"];
    services["lxca"]["password"] = configs["lxca_password"];

    services["satellite"] = new Object();
    services["satellite"]["name"] = "Satellite";
    services["satellite"]["url"] = configs["satellite_url"]

    return services;
  },
  render: function(){
    var services = this.getServices();
    var keys = Object.keys(services);
    var rows = keys.map(function(key){
      return (
        <tr><td>
          {key}
        </td><td>
          <a href={services[key].url}>
            {services[key].url}
          </a>
        </td><td>
          {services[key].username}
        </td><td>
          {services[key].password}
        </td></tr>
      );
    });

    return (
      <table className="table striped">
        <thead>
          <tr>
          <th>Service</th>
          <th>URL</th>
          <th>Username</th>
          <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});


var RootBox = React.createClass({
  getInitialState: function() {
    return {
      config_server: "downloads/",
      config: null,
      config_url:"example/",
      config_filename: "brain1_ansible_vars2.yml"
    }
  },
  getUrl: function() {
    // Build API url
    return this.state.config_server+this.state.config_url+this.state.config_filename;
  },
  handleUpdate: function(data){
    this.setState({
      config: yaml.load(data),
    });
  },
  componentDidMount: function(){
    var video = document.getElementById("myVideo");
    video.play();
  },
  render: function() {
    // get config
    if (this.state.config === null) {
      var api = this.getUrl();
      return (
        <AjaxYamlContainer apiUrl={api} handleUpdate={this.handleUpdate} />
      );
    }


    // pretty print
    var me = JSON.stringify(this.state.config, null, 2);
    return (
      <div className="container">

        <div className="pin-card z-deph-2">
          <ServiceList config={this.state.config}
                       config_server={this.state.config_server} />
        </div>

        <div className="pin-card z-deph-2">
          <h5>
            Phase 4: Deploy RHHI
          </h5>

          <strong className="myhighlight">
            Baseline Configs
          </strong>/Network
          <Networks
            config={this.state.config} />
        </div>

        <div className="pin-card z-deph-2">
          <h5>
            Phase 3: Provision Server
          </h5>
          <BootstrapServices
            config={this.state.config} />
        </div>


        <div className="pin-card z-deph-2">
          <h5>
            Phase 2: Prepare Server
          </h5>

          <strong className="myhighlight">
            RAID Cache Policy
          </strong>
          <RaidCachePolicy
            config={this.state.config.raid_info} />

          <strong className="myhighlight">
            RAID Configs
          </strong>
          <RaidConfig
            config={this.state.config.raid_info} />
        </div>

        <div className="pin-card z-depth-2">
          <h5>
            Phase 1: Discovery Server
          </h5>
          <Servers
            config={this.state.config} />
        </div>

      </div>
    );
  }
});

module.exports = RootBox;
