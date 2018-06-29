import React, { Component } from 'react';
import { Container, Header, Modal, Button, Grid, Card } from 'semantic-ui-react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';

class MyOccurrences extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occurrences: []
    };
  }

  componentWillMount() {
    axios.get('http://localhost:5050/occurrences?user=' + localStorage.getItem('user_id'))
      .then( (response) => {
        let occurrences = [];
        for (let i = 0; i < response.data.length; i++) {
          occurrences.push(
            <Card key={i} style={{ width: "100%" }}>
              <Card.Content>
                <Card.Header>{response.data[i].title}</Card.Header>
                <Card.Meta><Link to={"/occurrences/" + response.data[i].id}>See more</Link></Card.Meta>
                <Card.Description>{response.data[i].description}</Card.Description>
                <Card.Content extra style={{ marginTop: "2%" }}>
                    <Button basic color='red' style={{ width: "100%" }}>
                      Close
                    </Button>
                </Card.Content>
              </Card.Content>
            </Card>
          );
        }
        this.setState({
          occurrences: occurrences,
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  render () {
    localStorage.setItem('reload', 'NULL');
    if (localStorage.getItem('user_id') === "NULL") this.props.history.push("/login");
    return (
      <Container>
        <Grid centered>
          <Header as='h1'>My occurrences</Header>
        </Grid>
        <Grid centered><Grid.Row><Grid.Column width={10}>
          {this.state.occurrences}
        </Grid.Column></Grid.Row></Grid>
      </Container>
    );
  }
};

export default MyOccurrences;
