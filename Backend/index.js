const express = require('express');
require('dotenv').config(); 
const { db } = require('./firebase'); 

const app = express();
const port = process.env.PORT || 3000; 


app.get('/test-firestore', async (req, res) => {
  try {
    const testDocRef = db.collection('test').doc('testDoc');
    const testDoc = await testDocRef.get();
    
    if (!testDoc.exists) {
      await testDocRef.set({ message: 'Hello from Firestore!' });
      return res.send('Document created successfully!');
    }

    res.send(testDoc.data());
  } catch (error) {
    res.status(500).send('Error fetching document: ' + error);
  }
});



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
