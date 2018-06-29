import React, { Component } from 'react';
import { Container, Form, Button, Grid, Header } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";

class NewSolution extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      id: this.props.match.params.id,
      description: null,
      deadline: null,
      value: 0
    };
  }

  componentWillMount() {
    
  }

  handleSubmit() {
    let deadline = this.state.deadline.getTime();
    let formValidated = false;
    if (this.state.description && parseInt(this.state.value) && this.state.deadline) {
      formValidated = true;
    }
    if (formValidated) {
      console.log(deadline);
      axios.post('http://localhost:5050/solutions/new?' 
      + "description=" + this.state.description 
      + "&author=" + localStorage.getItem('user_id')
      + "&value=" + this.state.value
      + "&deadline=" + deadline
      + "&occurrence=" + this.state.id, {
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  render () {
    localStorage.setItem('reload', 'NULL');
    if (localStorage.getItem('user_id') === "NULL") {
      this.props.history.push("/login");
    }
 
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>Regist a new solution</Header>
        </Grid>
        <Grid className="centered"><Grid.Row><Grid.Column width={10}>
          <Form>      
            <Form.TextArea required label='Describe the solution' placeholder='Description' onChange={ (e) => this.setState({ description: e.target.value }) }/>
            <Form.Input required label='Whats the value of this solution?' placeholder='Value' type='number' onChange={ (e) => this.setState({ value: e.target.value }) }/>
            <p><strong>When is the deadline of this solution?</strong></p>
            <DayPickerInput onDayChange={ (e) => this.setState({ deadline: e }) }/>
            <Button fluid style={{ marginTop: "3%"}} onClick={ this.handleSubmit.bind(this) }>Submit</Button>
          </Form>
          <Button fluid style={{ marginTop: "3%" }}><Link to={"/occurrences/" + this.state.id} style={{ color: "black" }}>Go Back</Link></Button>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    )
  }
};

export default NewSolution;
