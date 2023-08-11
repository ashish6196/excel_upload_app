import React, { useState } from "react";
import "./App.css";
import { Button, Container, TextField } from "@mui/material";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";

function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setJsonData(response.data); // Set the received JSON data

      // Store the data in Firebase Realtime Database
      const database = firebase.database();
      const newDataRef = database.ref("uploadedData").push();
      newDataRef.set(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Container>
      <h1>Excel Upload and JSON Display App</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={e => setFile(e.target.files[0])}
      />
      <Button variant="contained" onClick={handleFileUpload}>
        Upload
      </Button>
      {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>}
    </Container>
  );
}

export default App;
