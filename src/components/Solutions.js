import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Label, Button, Grid, Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-spinkit';
import axios from 'axios';

class Solutions extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      idOccurrence: this.props.location.state.occId,
      idSolution: this.props.match.params.idS,
      occTitle: this.props.location.state.occTitle || '',
      occImage: this.props.location.state.occImage || '',
      upvoteColor: "grey",
      downvoteColor: "grey",
      loading: true,
      upvoteExists: false
    };
    this.handleDownvote = this.handleDownvote.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/solutions/' + this.state.idSolution)
      .then( (response) => {
        this.setState({
          loading: false,
          downvotes: response.data.downvotes,
          openDate: response.data.openDate,
          deadline: response.data.deadline,
          upvotes: response.data.upvotes,
          description: response.data.description,
          status: response.data.status,
          creator: response.data.user,
          value: response.data.value
        });
      })
      .catch( (error) => {
        console.log(error);
      });
    axios.get('http://localhost:5050/solutionVotes/pair?user=' + 
      localStorage.getItem('user_id') +
      '&solution=' + this.state.idSolution
    )
      .then( (response) => {
        if (response.data === true) {
          this.setState({
            upvoteColor: "#2185d0",
            upvoteExists: true
          });
        } else if (response.data === false) {
          this.setState({
            downvoteColor: "#db2828",
            upvoteExists: true
          });
        } 
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleUpvote() {
    if (this.state.upvoteColor !== 'blue') {
      axios.post('http://localhost:5050/solutionVotes/new?user=' +
        localStorage.getItem('user_id') +
        '&solution=' + this.state.idSolution +
        '&vote=' + true +
        '&exists=' + this.state.upvoteExists
      )
        .then( (response) => {
          let upvotes = this.state.upvoteExists ? this.state.upvotes + 2 : this.state.upvotes + 1;
          this.setState({
            upvoteColor: "#2185d0",
            downvoteColor: "grey",
            upvotes: upvotes
          });
        })
        .catch( (error) => {
          console.log(error);
        }); 
    }
  }

  handleDownvote() {
    if (this.state.downvoteColor !== 'red') {
      axios.post('http://localhost:5050/solutionVotes/new?user=' +
        localStorage.getItem('user_id') +
        '&solution=' + this.state.idSolution +
        '&vote=' + false +
        '&exists=' + this.state.upvoteExists
      )
        .then( (response) => {
          let upvotes = this.state.upvoteExists ? this.state.upvotes - 2 : this.state.upvotes - 1;
          this.setState({
            downvoteColor: "#db2828",
            upvoteColor: "grey",
            upvotes: upvotes
          });
        })
        .catch( (error) => {
          console.log(error);
        }); 
    }
  }

  render() {
    localStorage.setItem('reload', 'NULL');
    if (this.state.loading) {
      return <center><Spinner name="ball-scale-ripple" style={{ marginTop: "25%" }}/></center>;
    }
    let solutions = [];
    if (this.state.solution) {
      for (let i = 0; i < this.state.solution.length; i++) {
        solutions.push(
          <Card key={i} style={{ width: "100%" }}>
            <Card.Content>
              <Card.Header>{this.state.solution[i].user.firstName + " " + this.state.solution[i].user.lastName}</Card.Header>
              <Card.Meta>See more</Card.Meta>
              <Card.Description>{this.state.solution[i].description}</Card.Description>
            </Card.Content>
          </Card>
        );
      }
    }
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      openDate = this.state.openDate ? new Date(this.state.openDate).toLocaleDateString('en-US', options) : '',
      deadline = this.state.deadline ? new Date(this.state.deadline).toLocaleDateString('en-US', options) : '',
      creatorName = this.state.creator.firstName + " " + this.state.creator.lastName;
    return (
      <Container>
        <Grid centered>
          <Header as='h2'>
            <Link to={"/occurrences/" + this.state.idOccurrence}><span style={{ color: "black" }}>{this.state.occTitle}<Label horizontal>Solution</Label></span></Link>
          </Header>
        </Grid>
        <Grid centered><Grid.Row><Grid.Column width={10}>
          <Image src={this.state.occImage} /><p></p>
          <p><strong>Description: </strong>{this.state.description}</p>
          <p><strong>Open date: </strong>{openDate}</p>
          <p><strong>Deadline: </strong>{deadline}</p>
          <p><strong>Value: </strong>{this.state.value} $</p>          
          <p><strong>Creator: </strong>
            <Label as='a' image style={{ backgroundColor: 'white' }}>
              <img src={this.state.creator.avatar} />
              {creatorName}
            </Label>
          </p>
          <p><strong>Votes: </strong>
            <Icon onClick={this.handleUpvote} style={{ color: this.state.upvoteColor, marginRight: "0.8%" }} name='arrow up' />
            {this.state.upvotes - this.state.downvotes}  
            <Icon onClick={this.handleDownvote} style={{ color: this.state.downvoteColor, marginLeft: "1%" }} name='arrow down' /></p>
            <Button secondary fluid><Link to={"/occurrences/" + this.state.idOccurrence} style={{ color: "white" }}>Back to occurrence</Link></Button>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    );
  }
};

export default Solutions;
