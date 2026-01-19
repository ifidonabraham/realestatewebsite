const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g,'_'));
  }
});
const upload = multer({ storage });

// serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// simple upload endpoint: returns { url }
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('identify', (email) => {
    socket.data.email = email;
  });

  socket.on('chat message', (msg) => {
    // broadcast to everyone
    io.emit('chat message', msg);
  });

  socket.on('typing', (d) => {
    // forward typing hint to target only
    if (d && d.to) {
      // broadcast to all (can refine to rooms later)
      io.emit('typing', d);
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log('Chat server running on http://localhost:' + PORT));