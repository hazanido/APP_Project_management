const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const { db } = require('./firebase'); 
const userRoutes = require('./src/Routes/userRoute'); 
const projectRoutes = require('./src/Routes/projectRoute');
const taskRoutes = require('./src/Routes/taskRoute');
const messageRoutes = require('./src/Routes/messageRoute');

const app = express();
const port = process.env.PORT || 3000; 
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
