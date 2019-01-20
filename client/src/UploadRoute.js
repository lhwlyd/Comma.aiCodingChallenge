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
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  handleClick = () => {
    this.pond.getFiles().forEach(File => {
      this.pond.processFile(File);
      let fileReader = new FileReader();
      fileReader.onload = e => {
        let data = JSON.parse(e.target.result);
        console.log(data);
        fetch("/api/routes/postRoute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }).then(res => {
          if (res.status === 200) {
            this.pond.getFile(File).abortProcessing();
            console.log("upload success");
          }
        });
      };
      fileReader.readAsText(File.file);
    });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>submit</button>
        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={ref => (this.pond = ref)}
          allowMultiple={true}
          maxFiles={200}
          oninit={() => this.handleInit()}
          acceptedFileTypes={["application/json"]}
          maxFileSize={"2MB"}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        >
          {/* Update current files  */}
          {this.state.files.map(file => (
            <File key={file} src={file} origin="local" />
          ))}
        </FilePond>
      </div>
    );
  }
}
