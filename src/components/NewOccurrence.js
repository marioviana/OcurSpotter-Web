import React, { Component } from 'react';
import { Container, Form, Button, Grid, Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { withRouter } from "react-router-dom";
import { stringify } from "qs";
import Geocode from "react-geocode";
import { Map, TileLayer, Marker } from 'react-leaflet';

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

const CLOUDINARY_UPLOAD_PRESET = 'ocurspotter';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/marioviana/upload';

class NewOccurrence extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      title: null,
      description: null,
      uploadedFile: null,
      uploadedFileCloudinaryUrl: '',
      types: null,
      center: {
        lat: 20,
        lng: 20,
      },
      marker: {
        lat: 20,
        lng: 20,
      },
      zoom: 6,
      draggable: true,
      address: '',
      search: ''
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
    if (formValidated) {
      axios.post('http://localhost:5050/occurrences/new', 
        stringify({
          title: this.state.title,
          description: this.state.description,
          type: this.state.type, 
          lat: this.state.marker.lat,
          lon: this.state.marker.lng,
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

  updatePosition(e) {
    let lat = e.target._latlng.lat,
      lng = e.target._latlng.lng;
    Geocode.setApiKey("AIzaSyAgzcXinSLPPfMZTov2URj_f-Jk99tz8lw");
    Geocode.fromLatLng(lat, lng).then(
      response => {
        let address = response.results[0].formatted_address;
        this.setState({
          address: address
        });
      },
      error => {
        this.setState({
          address: '',
        });
        console.error(error);
      }
    );
    this.setState({
      marker: { lat, lng }
    });
  }

  handleAddress() {
    Geocode.setApiKey("AIzaSyAgzcXinSLPPfMZTov2URj_f-Jk99tz8lw");
    Geocode.fromAddress(this.state.search).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          marker: { lat, lng }
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  render () {
    if (localStorage.getItem('user_id') === 'NULL') {
      this.props.history.push('/login');
    }
    const markerPosition = [this.state.marker.lat, this.state.marker.lng];
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
                <Form.Select 
                  fluid 
                  label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='type.occurrence' /></strong>}
                  onChange={(e, { value }) => this.setState({ type: value })}
                  options={options}
                  placeholder='Occurrence type' 
                />
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
                <div style={{ display: "inline" }}>
                  <Form.Input 
                    label={<strong style={{ fontSize: ".92857143em", display: "block", marginBottom: "4px" }}><FormattedMessage id='pick.place' />:</strong>}
                    onChange={ (e) => this.setState({ search: e.target.value }) }
                    placeholder='Title'
                    style={{ width: '80%', float: "left" }}
                  />
                  <Button style={{ float: 'right', marginTop: "-9px", marginBottom: "2%", width: "15%" }}secondary type="button" onClick={this.handleAddress.bind(this)}>Search</Button>
                </div>
                <Map center={this.state.marker} zoom={4} maxZoom={18} minZoom={2} style={{ height: "400px" }} >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    draggable={true}
                    onDragend={this.updatePosition.bind(this)}
                    position={markerPosition}/>
                </Map>
                <input value={this.state.address}/>
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
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
};

export default NewOccurrence;
