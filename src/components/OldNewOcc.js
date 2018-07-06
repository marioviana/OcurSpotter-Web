import React, { Component } from 'react';
import { Container, Form, Button, Grid, Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { withRouter } from "react-router-dom";
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

require('../../dist/jquery-gmaps-latlon-picker');
require('../../dist/locationpicker.jquery');

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
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
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
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
    let formValidated = false, 
      title = this.state.title, 
      description = this.state.description;
    if (title && title.length > 4 && title.length < 50 && description && 
        description.length > 4 && this.state.type && this.state.uploadedFile) {
      formValidated = true;
    }
    this.setState({
      lat: document.getElementById("latitude").value,
      lon: document.getElementById("longitude").value 
    });
    if (formValidated) {
      axios.post('http://localhost:5050/occurrences/new', 
        stringify({
          title: this.state.title,
          description: this.state.description,
          type: this.state.type, 
          lat: document.getElementById("latitude").value,
          lon: document.getElementById("longitude").value, 
          author: localStorage.getItem('user_id'),
          image: this.state.uploadedFileCloudinaryUrl
        })
      )
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
      //window.location.reload();
      localStorage.setItem('reload', 1);
    }
    if (localStorage.getItem('user_id') === 'NULL') {
      this.props.history.push('/login');
    }

    let options = [];
    if (this.state.types) {
      this.state.types.map( type =>
        options.push({ text: type.name , value: type.id, image: { avatar: true, src: type.avatar } })
      );
    }

    return (
      <Container>
        <Grid centered>
          <Header as='h1'><FormattedMessage id='regist.occurrence' /></Header>
        </Grid>
        <Grid className="centered">
          <Grid.Row>
            <Grid.Column width={10}>
              <Form>
                <fieldset className="gllpLatlonPicker" style={{ border: 0 }}>
                  <Form.Input 
                    label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='name.occurrence' />:</strong>}
                    onChange={ (e) => this.setState({ title: e.target.value }) }
                    placeholder='Title'
                  />
                  <Form.TextArea 
                    label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='description.occurrence' />:</strong>}
                    onChange={ (e) => this.setState({ description: e.target.value }) }
                    placeholder='Description'
                  />
                  <Form.Select 
                    fluid 
                    label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='type.occurrence' /></strong>}
                    onChange={(e, { value }) => this.setState({ type: value })}
                    options={options}
                    placeholder='Occurrence type' 
                  />
                  <div className="field" style={{ marginBottom: "-2%" }}>
                    <label><FormattedMessage id='pick.place' />:</label>
                    <input 
                      className="gllpSearchField" 
                      placeholder="Address" 
                      style={{ width: "85.8%", marginRight: "1%" }}
                      type="text" 
                    />
                    <Button 
                      className="gllpSearchButton" 
                      secondary 
                      type="button" 
                      value="search"
                    >
                      <FormattedMessage id='search' />
                    </Button>
                  </div>
                  <br/>
                  <div className="gllpMap" style={{ width: "100%" }}>Maps</div>
                  {/* Latitude */}
                  <input 
                    className="gllpLatitude" 
                    hidden 
                    id="latitude" 
                    style={{ width: "30%" }}
                    type="text" 
                  /> 
                  {/* Longitude */}
                  <input 
                    className="gllpLongitude" 
                    hidden 
                    id="longitude" 
                    style={{ width: "30%"}} 
                    type="text"   
                  />
                  {/* Zoom */}
                  <input 
                    className="gllpZoom" 
                    hidden 
                    style={{ width: "30%" }} 
                    type="text" 
                    value="3"
                  /> 
                  <input 
                    className="gllpUpdateButton" 
                    hidden 
                    type="button" 
                    value="update map"
                  />
                  <input className="gllpLocationName"/>
                  <div 
                    className="FileUpload field" 
                    style={{ marginTop: "2%" }}
                  >
                    <label><FormattedMessage id='upload.photo' />:</label>
                    <Dropzone
                      accept="image/*"
                      multiple={false}
                      onDrop={this.onImageDrop}
                      style={{ width: "100%", height: "30%", border: "1px solid black", borderStyle: "dashed", borderRadius: "5px" }}>
                      <div style={{ marginLeft: "2%", marginTop: "2%", marginBottom: "2%" }}>
                        <FormattedMessage id='drop.upload' />
                      </div>
                    </Dropzone>
                  </div>
                  <div>
                    {this.state.uploadedFileCloudinaryUrl === '' ? null :
                      <div>
                        <p>
                          <strong><FormattedMessage id='images' />: </strong>{this.state.uploadedFile.name}
                        </p>
                        <center>
                          <Image 
                            rounded 
                            src={this.state.uploadedFileCloudinaryUrl} 
                            style={{ maxHeight: "250px" }}
                          />
                        </center>
                      </div>}
                  </div>
                  <Button 
                    fluid 
                    onClick={this.handleSubmit} 
                    primary 
                    style={{ marginTop: "5%"}}
                  >
                    <FormattedMessage id='submit' />
                  </Button>
                </fieldset>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
};

export default NewOccurrence;
