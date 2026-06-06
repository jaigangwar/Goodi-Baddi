const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const feedbackRoutes = require('./routes/feedback');
const companyRoutes = require('./routes/company');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Goodi Baddi API is running');
});

const PORT = process.env.PORT || 5000;

// Since we may not have a MongoDB instance running locally on every test machine,
// we will connect to a MongoDB cluster if MONGODB_URI is provided.
// For the sake of this test task, if it fails, the server will still run without DB (with a warning).
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goodi-baddi';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Running API server without DB for now (API calls will fail). Please set MONGODB_URI.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
