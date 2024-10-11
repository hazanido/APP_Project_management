const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const { db } = require('./firebase'); 
const userRoutes = require('./src/Routes/userRoute'); 

const app = express();
const port = process.env.PORT || 3000; 
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
