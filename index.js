const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
    .connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((self) => {
        console.log(`Connected to the database: "${self.connection.name}"`);
        // Before adding any recipes to the database, let's remove all existing ones
        return Recipe.deleteMany();
    })
    .then(() => {
        // Run your code here, after you have insured that the connection was made
        Recipe.create({
            title: 'French Fries Brazil',
            level: 'UltraPro Chef',
            ingredients: ['2 potatoes', 'salt to taste', 'pepper', 'oil'],
            cuisine: 'Brazilian',
            dishType: 'snack',
            image: 'https://img.itdg.com.br/tdg/images/recipes/000/018/897/164773/164773_original.jpg?mode=crop&width=710&height=400',
            duration: 30,
            creator: 'Sander Iwase',
        })
            .then((createdRecipe) => console.log(createdRecipe.title))
            .then(() => {
                Recipe.insertMany(data)
                    .then((results) => {
                        for (let recipe of results) {
                            console.log(recipe.title);
                        }
                    })
                    .then(() => {
                        Recipe.findOneAndUpdate(
                            { title: 'Rigatoni alla Genovese' },
                            { $set: { duration: 100 } },
                            { new: true }
                        )
                            .then((message) =>
                                console.log('Updated recipe: ', message)
                            )
                            .catch((error) => console.error(error));
                    })
                    .then(() => {
                        Recipe.deleteOne({ title: 'Carrot Cake' })
                            .then((result) => console.log(result))
                            .then(() => mongoose.connection.close());
                    });
            });
    })
    .catch((error) => {
        console.error('Error connecting to the database', error);
    });
