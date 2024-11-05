/********************************************************************************
* WEB322 – Assignment 04
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: _____________Akanksha_________ Student ID: _____155514227_________ Date: ___30-09-24___________
*
* Published URL: https://legos-app.vercel.app/
*
********************************************************************************/
const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for flexibility

// Serve static files (e.g., images, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Set up EJS for templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialize the LEGO data before setting up routes
legoData.initialize()
    .then(() => {
        // Home route
        app.get("/", (req, res) => {
            res.render("home", { page: '/' });
        });

        // About page route
        app.get("/about", (req, res) => {
            res.render("about", { page: '/about' });
        });

        // Route to get LEGO sets by theme or all sets
        app.get('/lego/sets', async (req, res) => {
            const theme = req.query.theme;
            try {
                let sets;
                if (theme) {
                    sets = await legoData.getSetsByTheme(theme);
                    if (!sets || sets.length === 0) {
                        return res.status(404).render("404", {
                            message: `No LEGO sets found for theme: ${theme}`,
                            page: req.originalUrl
                        });
                    }
                } else {
                    sets = await legoData.getAllSets();
                }
                
                res.render('sets', { sets, page: req.originalUrl });
            } catch (err) {
                console.error("Error fetching LEGO sets:", err);
                res.status(500).render("404", {
                    message: "Unable to fetch LEGO sets. Please try again later.",
                    page: req.originalUrl
                });
            }
        });

        // Route to get a specific LEGO set by its number
        app.get("/lego/sets/:set_num", async (req, res) => {
            try {
                const set = await legoData.getSetByNum(req.params.set_num);
                if (!set) {
                    return res.status(404).render("404", {
                        message: `No LEGO set found with number: ${req.params.set_num}`,
                        page: req.originalUrl
                    });
                }
                res.render("set", { set, page: req.originalUrl });
            } catch (err) {
                console.error(`Error fetching set #${req.params.set_num}:`, err);
                res.status(500).render("404", {
                    message: "Unable to find the requested LEGO set. Please try again later.",
                    page: req.originalUrl
                });
            }
        });

        // Custom 404 page for unmatched routes
        app.use((req, res) => {
            res.status(404).render("404", {
                message: `Page not found: ${req.originalUrl}`,
                page: req.originalUrl
            });
        });
    })
    .catch(err => {
        console.error("Failed to initialize LEGO data:", err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
