import React, { Component } from 'react';
import { Container, Form, Button, Grid, Tab, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import axios from 'axios';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      usernameSI: null, 
      passwordSI: null,
      usernameSU: null,
      mailSU: null,
      fistNameSU: null,
      lastNameSU: null,
      passwordSU: null 
    };
  }

  handleSubmitLogin() {
    let authTemp = this.state.usernameSI + ":" + this.state.passwordSI;
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
    axios.post('http://localhost:5050/signup?' + 
        'username=' + this.state.usernameSU +
        '&email=' + this.state.mailSU +
        '&password=' + this.state.passwordSU +
        '&firstName=' + this.state.firstNameSU +
        '&lastName=' + this.state.lastNameSU)
      .then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  render () {
    localStorage.setItem('reload', 'NULL');
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>Welcome back!</Header>
        </Grid>
        <Grid className="centered"><Grid.Row><Grid.Column width={8}>
        <Tab menu={{ secondary: true, pointing: true }} panes={[
                        { menuItem: 'Sign In', 
                          render: () => 
                          <Form>
                            <Form.Input label='Username' onChange={ (e) => this.setState({ usernameSI: e.target.value }) }/>
                            <Form.Input label='Password' type='password' onChange={ (e) => this.setState({ passwordSI: e.target.value }) }/>
                            <Button onClick={ this.handleSubmitLogin.bind(this) }>Submit</Button>
                          </Form>
                        },
                        { menuItem: 'Sign Up',
                          render: () => 
                          <Form>
                            <Form.Input label='Username' onChange={ (e) => this.setState({ usernameSU: e.target.value }) }/>
                            <Form.Input label='Email' onChange={ (e) => this.setState({ mailSU: e.target.value }) }/>
                            <Form.Input label='First Name' onChange={ (e) => this.setState({ firstNameSU: e.target.value }) }/>
                            <Form.Input label='Last Name' onChange={ (e) => this.setState({ lastNameSU: e.target.value }) }/>
                            <Form.Input label='Password' type='password' onChange={ (e) => this.setState({ passwordSU: e.target.value }) }/>
                            <Button onClick={ this.handleSubmitSignup.bind(this) }>Submit</Button>
                          </Form> 
                        },
                      ]}>
        </Tab>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    )
  }
};

export default Login;
