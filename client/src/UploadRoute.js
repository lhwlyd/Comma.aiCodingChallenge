import React from "react";
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default class UploadRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

    this.fileReader = new FileReader();

    this.fileReader.onload = e => {
      let data = JSON.parse(e.target.result);
      console.log(data);
      fetch("/api/routes/postRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(res => console.log(res));
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  handleClick = () => {
    const data = [];

    this.pond.getFiles().forEach(File => {
      this.fileReader.readAsText(File.file);
    });
  };

  render() {
    return (
      <div className="App">
        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={ref => (this.pond = ref)}
          allowMultiple={true}
          maxFiles={5}
          oninit={() => this.handleInit()}
          acceptedFileTypes={["application/json"]}
          maxFileSize={"2MB"}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
            console.log(this.state.files);
          }}
          onprocessfile={(err, file) => this.onProcessFile(err, file)}
          onprocessfilestart={file => console.log(file)}
        >
          {/* Update current files  */}
          {this.state.files.map(file => (
            <File key={file} src={file} origin="local" />
          ))}
        </FilePond>

        <button onClick={this.handleClick}>submit</button>
      </div>
    );
  }
}
