import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Flag } from 'semantic-ui-react';

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import pt from 'react-intl/locale-data/pt';
import de from 'react-intl/locale-data/de';

addLocaleData([...en, ...fr, ...es, ...pt, ...de]);

import {
    injectIntl,
    IntlProvider,
    FormattedRelative,
    FormattedMessage
} from 'react-intl';

class Sidenav extends Component {

  constructor(props) {
    super(props);
    this.state = { activeItem: null };  
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick (e, { name }) {
    this.setState({ activeItem: name });
  }

  handleLogout() {
    localStorage.setItem('user_id', "NULL");
  }

  handleFlag(loc) {
    if (this.props.locale !== loc) {
      this.props.changeLang(loc);
    }
  }
  
  render () {
    /*if (this.props.locale !== 'es') {
      this.props.changeLang('es');
    }*/
    const activeItem = this.state.activeItem;
    const login = [];
    if (localStorage.getItem('user_id') === "NULL") {
      login.push(
        <Link 
          key='signin' 
          to="/login"
        >
          <Menu.Item 
            active={activeItem === 'login'} 
            key="signin" 
            name='login' 
            onClick={this.handleItemClick}
          >
            <FormattedMessage id='signin' />
          </Menu.Item>
        </Link>
      );
    } else {
      login.push(
        <Link 
          key="my" 
          to="/my/occurrences"
        >
          <Menu.Item 
            active={activeItem === 'my'} 
            key="my" 
            name='my'
            onClick={this.handleItemClick}
          >
            <FormattedMessage id='my.occurrences' />
          </Menu.Item>
        </Link>
      );
      login.push(
        <Link 
          key="stats" 
          to="/stats"
        >
          <Menu.Item 
            active={activeItem === 'stats'} 
            key="stats" 
            name='stats'
            onClick={this.handleItemClick}
          >
            <FormattedMessage id='stats' />
          </Menu.Item>
        </Link>
      );
      login.push(
        <Link 
          key="profile" 
          to="/profile"
        >
          <Menu.Item 
            active={activeItem === 'profile'} 
            key="profile" 
            name='profile'
            onClick={this.handleItemClick}
          >
            <FormattedMessage id='profile' />
          </Menu.Item>
        </Link>);
      login.push(
        <Link 
          key="logout" 
          to="/login"
        >
          <Menu.Item 
            active={activeItem === 'logout'} 
            key="logout" 
            name='logout' 
            onClick={this.handleLogout}
          >
            <FormattedMessage id='signout' />
          </Menu.Item>
        </Link>
      );  
    }
    return (
      <div className="sidenav">
        <Menu pointing secondary>
          <Link to="/">
            <Menu.Item 
              active={activeItem === 'home'} 
              header 
              name='home'
              style={{ color: "#3a6499" }}
              onClick={this.handleItemClick}
            >
              OcurSpotter
            </Menu.Item>
          </Link>      
          <Link to="/about">
            <Menu.Item 
              active={activeItem === 'about'} 
              name='about' 
              onClick={this.handleItemClick}
            >
              <FormattedMessage id='about' />
            </Menu.Item>
          </Link>     
          <Link to="/map">
            <Menu.Item 
              active={activeItem === 'map'} 
              name='map' 
              onClick={this.handleItemClick}
            >
              <FormattedMessage id='map' />
            </Menu.Item>
          </Link>
          <Link to="/occurrence">
            <Menu.Item 
              active={activeItem === 'occurrence'} 
              name='occurrence' 
              onClick={this.handleItemClick}
            >
              <FormattedMessage id='add.occurrence' />
            </Menu.Item>
          </Link>
          <Menu.Menu position='right'>
            {login}
            <Dropdown item compact text={<FormattedMessage id='language' />}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.handleFlag.bind(this, 'en')}><Flag name="gb" /></Dropdown.Item>
                <Dropdown.Item onClick={this.handleFlag.bind(this, 'es')}><Flag name="es" /></Dropdown.Item>
                <Dropdown.Item onClick={this.handleFlag.bind(this, 'fr')}><Flag name="fr" /></Dropdown.Item>
                <Dropdown.Item onClick={this.handleFlag.bind(this, 'de')}><Flag name="de" /></Dropdown.Item>
                <Dropdown.Item onClick={this.handleFlag.bind(this, 'pt')}><Flag name="pt" /></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu> 
        </Menu>
      </div>
    );
  }
};

export default Sidenav;
