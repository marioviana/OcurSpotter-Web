import React, { Component } from 'react';
import { Container, Form, Button, Grid, Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { withRouter } from "react-router-dom";

const CLOUDINARY_UPLOAD_PRESET = 'ocurspotter';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/marioviana/upload';

class NewOccurrence extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      title: null,
      description: null,
      lat: 0,
      lon: 0,
      uploadedFile: null,
      uploadedFileCloudinaryUrl: '',
      types: null
    };
  }

  componentWillMount() {
    axios.get('http://localhost:5050/types/')
      .then( (response) => {
        this.setState({
          types: response.data
        });
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  handleSubmit() {
    let formValidated = false;
    if (this.state.title && this.state.description && this.state.type) {
      formValidated = true;
    }
    this.setState({
      lat: document.getElementById("latitude").value,
      long: document.getElementById("longitude").value 
    });
    if (formValidated) {
      axios.post('http://localhost:5050/occurrences/new?title=' + this.state.title 
      + "&description=" + this.state.description 
      + "&type=" + this.state.type 
      + "&lat=" + document.getElementById("latitude").value
      + "&lon=" + document.getElementById("longitude").value 
      + "&author=" + localStorage.getItem('user_id')
      + "&image=" + this.state.uploadedFileCloudinaryUrl, {
      })
        .then(function (response) {
          this.props.history.push('/map');
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  render () {
    if (localStorage.getItem('reload') === 'NULL') {
      window.location.reload();
      localStorage.setItem('reload', 1);
    }
    if (localStorage.getItem('user_id') === 'NULL') {
      this.props.history.push('/login');
    }

    let options = [];
    if (this.state.types) {
      this.state.types.map( type =>
        options.push({ text: type.name , value: type.id })
      );
    }

    return (
      <Container>
        <Grid centered>
          <Header as='h1'>Regist a new occurrence</Header>
        </Grid>
        <Grid className="centered"><Grid.Row><Grid.Column width={10}>
          <Form>
            <fieldset className="gllpLatlonPicker" style={{ "border" : 0 }}>
              <Form.Input label='Name the occurrence' placeholder='Title' onChange={ (e) => this.setState({ title: e.target.value }) }/>
              <Form.TextArea label='Describe the occurrence' placeholder='Description' onChange={ (e) => this.setState({ description: e.target.value }) }/>
              <Form.Select label="What's the type of the occurrence?" fluid options={options} placeholder='Occurrence type' onChange={(e, { value }) => this.setState({ type: value }) }/>
              <div className="field" style={{ marginBottom: "-2%" }}>
                <label >Pick the place</label>
                <input placeholder="Address" type="text" className="gllpSearchField" style={{ width: "85.8%", marginRight: "1%" }}/>
                <Button type="button" className="gllpSearchButton" value="search">Search</Button>
              </div>
              <br/>
              <div className="gllpMap" style={{ width: "100%" }}>Maps</div>
              {/*lat:*/}
              <input hidden type="text" id="latitude" className="gllpLatitude" style={{ width: "30%" }}/> 
              {/*lon: */}
              <input hidden type="text" id="longitude" className="gllpLongitude" style={{ width: "30%"}}/>
              {/*zoom: */}
              <input hidden type="text" className="gllpZoom" value="3" style={{ width: "30%"}}/> 
              <input hidden type="button" className="gllpUpdateButton" value="update map"/>
              <input className="gllpLocationName"/>
              <div className="FileUpload field" style={{ marginTop: "2%" }}>
                <label>Upload a photo</label>
                <Dropzone
                  style={{ width: "100%", height: "30%", border: "1px solid black", borderStyle: "dashed", borderRadius: "5px" }}
                  onDrop={this.onImageDrop.bind(this)}
                  multiple={false}
                  accept="image/*">
                  <div style={{ marginLeft: "2%", marginTop: "2%", marginBottom: "2%" }}>Drop an image or click to select a file to upload.</div>
                </Dropzone>
              </div>

              <div>
                {this.state.uploadedFileCloudinaryUrl === '' ? null :
                <div>
                  <p><strong>Images: </strong>{this.state.uploadedFile.name}</p>
                  <center><Image src={this.state.uploadedFileCloudinaryUrl} rounded style={{ maxHeight: "250px" }}/></center>
                </div>}
              </div>
              <Button fluid style={{ marginTop: "5%"}} onClick={ this.handleSubmit.bind(this) }>Submit</Button>
            </fieldset>
          </Form>
          <form>
      </form>
        </Grid.Column></Grid.Row></Grid>
      </Container>
    )
  }
};

export default NewOccurrence;
