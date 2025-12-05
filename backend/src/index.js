const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('ClubSync API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
