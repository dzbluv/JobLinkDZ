const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables from server/.env if present, and fallback to root .env
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const users = require('./routes/users');
app.use('/api/users', users);
const adminAuth = require('./routes/adminAuth');
app.use('/api/admin', adminAuth);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
