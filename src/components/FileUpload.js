import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'


class FileUpload extends Component {

  state = {
      uploadedFileCloudinaryUrl:'',
      originalFileNameCloudinaryUrl:'',
      originalFileHeightCloudinaryUrl: 0,
      originalFileWidthCloudinaryUrl: 0,
      originalFileFormatCloudinaryUrl: '',
      createAtCloudinaryUrl: ''
  }

  handleDrop = files => {
    // Push all the axios request promise into a single array
    const uploaders = files.map(file => {
      // Initial FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", `codeinfuse, medium, gist`);
      formData.append("upload_preset", "vpxzvsye"); // Replace the preset name with your own
      formData.append("api_key", "298453577541125"); // Replace API key with your own Cloudinary key
      formData.append("timestamp", (Date.now() / 1000) || 0);
      
      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios.post("https://api.cloudinary.com/v1_1/wattcharger/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
        const data = response.data;
        const fileURL = data.secure_url // You should store this URL for future references in your app
        const fileName = data.original_filename
        const fileHeight = data.height
        const fileWidth = data.width
        const fileFormat = data.format
        const createAt = data.created_at
        // console.log(data);
        // console.log(fileURL);
        this.setState({uploadedFileCloudinaryUrl:fileURL});
        // console.log("setState... "+this.state.uploadedFileCloudinaryUrl);
        this.setState({originalFileNameCloudinaryUrl:fileName});
        // console.log("setState... "+this.state.originalFileNameCloudinaryUrl);
        this.setState({originalFileHeightCloudinaryUrl:fileHeight});
        // console.log("setState... "+this.state.originalFileHeightCloudinaryUrl);
        this.setState({originalFileWidthCloudinaryUrl:fileWidth});
        // console.log("setState... "+this.state.originalFileWidthCloudinaryUrl);
        this.setState({originalFileFormatCloudinaryUrl:fileFormat});
        // console.log("setState... "+this.state.originalFileFormatCloudinaryUrl);
        this.setState({createAtCloudinaryUrl:createAt});
        // console.log("setState... "+this.state.createAtCloudinaryUrl);
        
      })
    });
  
    // Once all the files are uploaded 
    axios.all(uploaders).then(() => {
      // ... perform after upload is successful operation
     
    });
  }

  render() {
    return (<div style={{marginTop:"50px"}}>
        <Dropzone
          width="10px" 
          onDrop={this.handleDrop} 
          multiple 
          accept="image/*" >
        <p style={{color: "grey", textAlign:"center", marginTop:"80px"}}>Drop your files or click here to upload</p>
      </Dropzone>
      <div>
        {this.state.uploadedFileCloudinaryUrl === '' ? null :
            <div>
                <p>{this.state.originalFileNameCloudinaryUrl}</p>
                <img alt={this.state.originalFileNameCloudinaryUrl} style={{width:"100px", height:"100px"}} src={this.state.uploadedFileCloudinaryUrl} />
            </div>
         }
       </div>
      </div>
    )
  }
  
}  

export default FileUpload