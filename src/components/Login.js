import React, { Component } from 'react';
import { Container, Form, Button, Grid, Tab, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import axios from 'axios';
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

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      usernameSI: '', 
      passwordSI: '',
      usernameSU: '',
      mailSU: '',
      fistNameSU: '',
      lastNameSU: '',
      passwordSU: '' 
    };
    this.handleSubmitSignup = this.handleSubmitSignup.bind(this);
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
  }

  handleSubmitLogin() {
    let authTemp = `${this.state.usernameSI}:${this.state.passwordSI}`;
    let auth = new Buffer(authTemp).toString('base64');
    axios.get('http://localhost:5050/login/' + auth)
      .then( (response) => {
        if (response.data.id) {
          localStorage.setItem('user_id', response.data.id);
          this.props.history.push('/map');
        }
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  handleSubmitSignup() {
    axios.post('http://localhost:5050/signup', 
      stringify({
        username: this.state.usernameSU,
        email: this.state.mailSU,
        password: this.state.passwordSU,
        firstName: this.state.firstNameSU,
        lastName: this.state.lastNameSU
      })
    )
      .then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  render () {
    return (
      <Container>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='welcome' /></Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={8}>
              <Tab 
                menu={{ secondary: true, pointing: true }} 
                panes={[{ menuItem: 'Sign In', 
                  render: () => (
                    <Form>
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='username' /></strong>}
                        onChange={(e) => this.setState({ usernameSI: e.target.value })} 
                        value={this.state.usernameSI}
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='password' /></strong>}
                        onChange={(e) => this.setState({ passwordSI: e.target.value })} 
                        type='password' 
                        value={this.state.passwordSI}
                      />
                      <Button 
                        onClick={this.handleSubmitLogin} 
                        primary
                      >
                        <FormattedMessage id='submit' />
                      </Button>
                    </Form>
                  )
                },
                { menuItem: 'Sign Up',
                  render: () => (
                    <Form>
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='username' /></strong>}
                        onChange={(e) => this.setState({ usernameSU: e.target.value })} 
                        value={this.state.usernameSU}
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='email' /></strong>}
                        onChange={(e) => this.setState({ mailSU: e.target.value })} 
                        value={this.state.mailSU}
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='first.name' /></strong>}
                        onChange={(e) => this.setState({ firstNameSU: e.target.value })} 
                        value={this.state.fistNameSU}
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='last.name' /></strong>}
                        onChange={(e) => this.setState({ lastNameSU: e.target.value })} 
                        value={this.state.lastNameSU} 
                      />
                      <Form.Input 
                        label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='password' /></strong>}
                        onChange={(e) => this.setState({ passwordSU: e.target.value })} 
                        type='password' 
                        value={this.state.passwordSU} 
                      />
                      <Button 
                        onClick={this.handleSubmitSignup} 
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
    )
  }
};

export default Login;
