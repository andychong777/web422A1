const express = require("express");
const cors = require("cors");
const CountriesDB = require("./modules/countriesDB.js");
const db = new CountriesDB();
const app = express();
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

//Test Route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get('/api/countries', async (req,res) => {
    const { page = 1, perPage = 10, name } = req.query;

    try {
        const countries = await db.getAllCountries(parseInt(page), parseInt(perPage), name);
        res.json(countries);
    } catch(error) {
        res.status(500).json({ error: 'Failed to retrieve countries' });
    }
});

// Route to add a new country
app.post('/api/countries', async (req, res) => {
    try {
        const newCountry = await db.addNewCountry(req.body);
        res.status(201).json(newCountry); // 201 status for a successful creation
    } catch (error) {
        res.status(500).json({ error: 'Failed to add country' });
    }
});

// Route to get a single country by ID
app.get('/api/countries/:id', async (req, res) => {
    try {
        const country = await db.getCountryById(req.params.id);
        if (country) {
            res.json(country);
        } else {
            res.status(404).json({ error: 'Country not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve country' });
    }
});

// Route to update a country by ID
app.put('/api/countries/:id', async (req, res) => {
    try {
        const updatedCountry = await db.updateCountryById(req.params.id, req.body);
        if (updatedCountry) {
            res.json(updatedCountry);
        } else {
            res.status(404).json({ error: 'Country not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update country' });
    }
});

// Route to delete a country by ID
app.delete('/api/countries/:id', async (req, res) => {
    try {
        const deletedCountry = await db.deleteCountryById(req.params.id);
        if (deletedCountry) {
            res.status(204).end(); // 204 status for a successful deletion with no content
        } else {
            res.status(404).json({ error: 'Country not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete country' });
    }
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server is running on port ${PORT}');
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message); //log the error msg
  });

console.log("Connecting to", process.env.MONGODB_CONN_STRING);