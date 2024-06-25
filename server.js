require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const myModule = require('./myModule');
const mySession = require('./mySession');
const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './home.html'));
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    myModule.registerUser(username, email, password, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Registration failed' });
        } else {
            res.json({ success: true });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    myModule.authenticateUser(email, password, (err, user) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server error' });
        } else if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        } else {
            req.session.user = user.username;
            res.json({ success: true });
        }
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to log out' });
        }
        res.json({ success: true });
    });
});

app.get('/get-recipe', (req, res) => {
    const title = req.query.title;
    myModule.getRecipeByTitle(title, (err, recipe) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch recipe' });
        } else if (!recipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
        } else {
            res.json({ success: true, recipe });
        }
    });
});

app.get('/user-recipes', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    myModule.getUserRecipes(req.session.user, (err, recipes) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch user recipes' });
        } else {
            res.json({ success: true, recipes });
        }
    });
});

app.get('/get-recipe-by-id', (req, res) => {
    const id = req.query.id;
    myModule.getRecipeById(id, (err, recipe) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch recipe' });
        } else if (!recipe) {
            res.status(404).json({ success: false, message: 'Recipe not found' });
        } else {
            res.json({ success: true, recipe });
        }
    });
});

app.post('/submit-recipe', (req, res) => {
    const { recipeId, title, description, ingredients, instructions, cookingTime, servingSize } = req.body;

    if (recipeId) {
        // Update existing recipe
        myModule.editRecipe(title, description, ingredients, instructions, cookingTime, servingSize, recipeId, req.session.user, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Failed to update recipe' });
            } else {
                res.json({ success: true });
            }
        });
    } else {
        // Submit new recipe
        myModule.submitRecipe(title, description, ingredients, instructions, cookingTime, servingSize, req.session.user, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Failed to submit recipe' });
            } else {
                res.json({ success: true });
            }
        });
    }
});

app.put('/edit-recipe/:id', (req, res) => {
    const { title, description, ingredients, instructions, cookingTime, servingSize } = req.body;
    const { id } = req.params;

    myModule.editRecipe(title, description, ingredients, instructions, cookingTime, servingSize, id, req.session.user, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to update recipe' });
        } else {
            res.json({ success: true });
        }
    });
});

app.delete('/delete-recipe/:id', (req, res) => {
    const { id } = req.params;

    myModule.deleteRecipe(id, req.session.user, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to delete recipe' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/featured-recipes', (req, res) => {
    myModule.getFeaturedRecipes((err, recipes) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch featured recipes' });
        } else {
            res.json({ success: true, recipes });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});