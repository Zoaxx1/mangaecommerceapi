const express = require('express');
const cors = require('cors');
const routerManga = require('./requests/mangas');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/mangas', routerManga);

app.listen(PORT);