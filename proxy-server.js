import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/proxy/home-buying', async (req, res) => {
  try {
    const response = await fetch('https://sos2425-21.onrender.com/api/v1/home-buying-selling-stats');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error al obtener datos de home-buying");
  }
});

app.get('/proxy/precipitation', async (req, res) => {
  try {
    const response = await fetch('https://sos2425-15.onrender.com/api/v1/precipitation-stats');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error al obtener datos de precipitation");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
