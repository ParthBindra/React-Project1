import { Typography } from '@mui/material';
import { useState } from 'react';
import './App.css';

function App() {
  const[file,setFile]=useState(null);
  const[progress,setProgress]=useState({started:false,pc:0});
  const[msg,setMsg]=useState(null);
  const[downloadUrl,setDownloadUrl]=useState(null);

  function handleUpload(){
    if(!file){
      console.log("no file selected");
      return;
    }

    const fd=new FormData();
    fd.append('file', file);
    setMsg("uploading....");
    setProgress(prevState=>{
      return{...prevState,started:true}
    });

    fetch('http://httpbin.org/post', {
      method: 'POST',
      body: fd,
      headers: {
        "custom-header": "value"
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      setMsg("upload Successful ");
      return res.json();
    })
    .then(data => {
      console.log(data);
      setDownloadUrl(data.url); // Assuming the server returns the uploaded file URL
    })
    .catch(err => {
      setMsg("upload Failed");
      console.error(err);
    });
  }

  function handleDownload(){
    if(!downloadUrl){
      console.log("No file available for download");
      return;
    }

    fetch(downloadUrl)
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(err => {
      console.error("Error downloading file: ", err);
    });
  }

  return (
    <div className="App">
      <Typography variant='h6'>
        Here we can upload and download files
      </Typography>
      <input onChange={(e)=>{setFile(e.target.files[0])}} type='file'/>
      <button onClick={handleUpload}>
        Upload
      </button>

      {progress.started  && <progress max="100" value={progress.pc}>
        
        </progress>}
      {msg && <span>{msg}</span>}

      <br/>
      <button onClick={handleDownload}>
        Download
      </button>
    </div>
  );
}

export default App;

/*axios.post('http://httpbin.org/post',fd,{
  onUploadProgress:(ProgressEvent)=>{

   setProgress(prevState=>{

    return {
      ...prevState,pc:ProgressEvent.progress*100
    }
   })
  },Headers:{

    "custom Header":"value"
  }
})
.then(res=>{setMsg("upload Suceesfull");
  
  console.log(res.data);
})
.catch(err=>{
  setMsg("upload Files")
  console.error(err);
});*/