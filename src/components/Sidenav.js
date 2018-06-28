import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class Sidenav extends Component {

  constructor(props) {
    super(props);
    this.state = { activeItem: null };  
  }

  handleItemClick (e, { name }) {
    this.setState({ activeItem: name });
  }

  handleLogout() {
    localStorage.setItem('user_id', "NULL");
  }
  
  render () {
    const activeItem = this.state.activeItem;
    const login = [];
    if (localStorage.getItem('user_id') === "NULL") {
      login.push(<Link key='sigin' to="/login"><Menu.Item key="signin" name='login' active={activeItem === 'login'} onClick={this.handleItemClick.bind(this)}>Sign In</Menu.Item></Link>);
    } else {
      login.push(<Link key="my" to="/my/occurrences"><Menu.Item key="my" name='my' active={activeItem === 'my'}>My Occurrences</Menu.Item></Link>);
      login.push(<Link key="profile" to="/profile"><Menu.Item key="profile" name='profile' active={activeItem === 'profile'}>Profile</Menu.Item></Link>);
      login.push(<Menu.Item key="signout" name='logout' onClick={this.handleLogout.bind(this)}>Sign Out</Menu.Item>);  
    }
    return (
      <div className="sidenav">
        <Menu secondary pointing>
          <Link to="/">
            <Menu.Item header name='home' active={activeItem === 'home'} onClick={this.handleItemClick.bind(this)}>OcurSpotter</Menu.Item>
          </Link>      
          <Link to="/about">
            <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick.bind(this)}>About</Menu.Item>
          </Link>     
          <Link to="/map">
            <Menu.Item name='map' active={activeItem === 'map'} onClick={this.handleItemClick.bind(this)}>Map</Menu.Item>
          </Link>
          <Link to="/occurrence">
            <Menu.Item name='occurrence' active={activeItem === 'occurrence'} onClick={this.handleItemClick.bind(this)}>Add Occurrence</Menu.Item>
          </Link>
          <Menu.Menu position='right'>
            {login}
          </Menu.Menu> 
        </Menu>
      </div>
    )
  }
};

export default Sidenav;
