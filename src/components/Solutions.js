import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Label, Button, Grid, Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
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
      downvoteColor: "grey"
    };
    this.handleDownvote = this.handleDownvote.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:5050/solutions/' + this.state.idSolution)
      .then( (response) => {
        this.setState({
          downvotes: response.data.downvotes,
          openDate: response.data.openDate,
          deadline: response.data.deadline,
          upvotes: response.data.upvotes,
          description: response.data.description,
          status: response.data.status,
          creatorName: response.data.user.firstName + " " + response.data.user.lastName,
          creatorAvatar: response.data.user.avatar,
          value: response.data.value
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleUpvote() {
    this.setState({
      upvoteColor: "blue",
      downvoteColor: "grey"
    });
  }

  handleDownvote() {
    this.setState({
      downvoteColor: "red",
      upvoteColor: "grey"
    });
  }

  render() {
    localStorage.setItem('reload', 'NULL');
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
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let openDate = this.state.openDate ? new Date(this.state.openDate).toLocaleDateString('en-US', options) : '';
    let deadline = this.state.deadline ? new Date(this.state.deadline).toLocaleDateString('en-US', options) : '';
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
          <p><strong>Creator: </strong>{this.state.creatorName}</p>
          <p><strong>Votes: </strong>
            <Icon onClick={this.handleUpvote} style={{ color: this.state.upvoteColor, marginRight: "0.8%" }} name='arrow up' />
            {this.state.upvotes - this.state.downvotes}  
            <Icon onClick={this.handleDownvote} style={{ color: this.state.downvoteColor, marginLeft: "1%" }} name='arrow down' /></p>
            <Button fluid><Link to={"/occurrences/" + this.state.idOccurrence} style={{ color: "black" }}>Back to occurrence</Link></Button>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    );
  }
};

export default Solutions;
