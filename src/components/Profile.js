import React, { Component } from 'react';
import { Container, Grid, Header, Form, Button, Tab, Dimmer, Icon } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-spinkit';
import { stringify } from "qs";

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

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: '',
      loading: true,
      active: false
    };
    this.handleSubmitProfile = this.handleSubmitProfile.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/users/' + localStorage.getItem('user_id'))
      .then( (response) => {
        this.setState({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          loading: false
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleSubmitProfile() {
    axios.post('http://localhost:5050/profile',
      stringify({
        user: localStorage.getItem('user_id'),
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
    )
      .then( (response) => {
        this.setState({ active: true });
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  handleSubmitPassword() {
    let oldPassword = new Buffer(this.state.oldPassword).toString('base64'),
      newPassword = new Buffer(this.state.newPassword).toString('base64');
    axios.post('http://localhost:5050/password', 
      stringify({
        user: localStorage.getItem('user_id'),
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    )
      .then( (response) => {
        this.setState({ active: true });
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  handleOpen() { this.setState({ active: true }); }
  handleClose() { this.setState({ active: false }); }

  render() {
    if (this.state.loading) {
      return (
        <center>
          <Spinner 
            name="ball-scale-ripple" 
            style={{ marginTop: "25%" }}
          />
        </center>
      );
    } 
    return (
      <Container>
        <Dimmer active={this.state.active} onClickOutside={this.handleClose.bind(this)} page>
          <Header as='h2' icon inverted>
            <Icon name='save' />
              Profile changed!
          </Header>
        </Dimmer>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='change.profile' /></Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={8}>
              <Tab 
                menu={{ secondary: true, pointing: true }} 
                panes={[{ menuItem: 'Profile', 
                  render: () => (
                    <Form>
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='email' /></strong>}
                        onChange={(e) => this.setState({ email: e.target.value })} 
                        value={ this.state.email }
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='first.name' /></strong>} 
                        onChange={(e) => this.setState({ firstName: e.target.value })} 
                        value={ this.state.firstName }
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='last.name' /></strong>}
                        onChange={(e) => this.setState({ lastName: e.target.value })} 
                        value={ this.state.lastName }
                      />
                      <Button 
                        onClick={this.handleSubmitProfile}
                        primary 
                      >
                        <FormattedMessage id='submit' />
                      </Button>
                    </Form>
                  )
                },
                { menuItem: 'Password',
                  render: () => (
                    <Form>
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block" }}><FormattedMessage id='old.password' /></strong>}
                        onChange={(e) => this.setState({ oldPassword: e.target.value })} 
                        type='password' 
                        value={ this.state.oldPassword }
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block" }}><FormattedMessage id='new.password' /></strong>}
                        onChange={(e) => this.setState({ newPassword: e.target.value })} 
                        type='password' 
                        value={ this.state.newPassword }
                      />
                      <Button
                        onClick={this.handleSubmitPassword} 
                        primary 
                      >
                        <FormattedMessage id='submit' />
                      </Button>
                    </Form> 
                  )
                },
                ]}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Profile;