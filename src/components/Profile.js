import React, { Component } from 'react';
import { Container, Grid, Header, Form, Button, Tab } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: ''
    };
  }

  componentWillMount() {
    axios.get('http://localhost:5050/users/' + localStorage.getItem('user_id'))
      .then( (response) => {
        this.setState({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleSubmitProfile() {
    axios.post('http://localhost:5050/profile?' + 
        'user=' + localStorage.getItem('user_id') +
        '&email=' + this.state.email +
        '&firstName=' + this.state.firstName +
        '&lastName=' + this.state.lastName)
      .then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  handleSubmitPassword() {
    let oldPassword = new Buffer(this.state.oldPassword).toString('base64');
    let newPassword = new Buffer(this.state.newPassword).toString('base64');
    axios.post('http://localhost:5050/password?' + 
        'user=' + localStorage.getItem('user_id') +
        '&oldPassword=' + oldPassword +
        '&newPassword=' + newPassword)
      .then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });  
  }

  render() {
    localStorage.setItem('reload', 'NULL');
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>Change your profile</Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row><Grid.Column width={8}>
            <Tab 
              menu={{ secondary: true, pointing: true }} 
              panes={[{ menuItem: 'Profile', 
                render: () => 
                  <Form>
                    <Form.Input label='Email' value={ this.state.email } onChange={ (e) => this.setState({ email: e.target.value }) }/>
                    <Form.Input label='First name' value={ this.state.firstName } onChange={ (e) => this.setState({ firstName: e.target.value }) }/>
                    <Form.Input label='Last name' value={ this.state.lastName } onChange={ (e) => this.setState({ lastName: e.target.value }) }/>
                    <Button primary onClick={ this.handleSubmitProfile.bind(this) }>Submit</Button>
                  </Form>
              },
              { menuItem: 'Password',
                render: () => 
                  <Form>
                    <Form.Input label='Old Password' value={ this.state.oldPassword } type='password' onChange={ (e) => this.setState({ oldPassword: e.target.value }) }/>
                    <Form.Input label='New Password' value={ this.state.newPassword } type='password' onChange={ (e) => this.setState({ newPassword: e.target.value }) }/>
                    <Button primary onClick={ this.handleSubmitPassword.bind(this) }>Submit</Button>
                  </Form> 
                },
              ]}/>
          </Grid.Column></Grid.Row>
        </Grid>
      </Container>
    );
  }
};

export default Profile;