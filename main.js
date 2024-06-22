const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/routes');
const { generateUUID } = require('./utils/helpers');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // Import MongoClient from mongodb package

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for user sessions
const userSessions = {};

// Middleware
app.use(express.json()); // Use built-in JSON body parser
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
connectDB();

// Function to insert menu items into MongoDB
async function insertMenuItems() {
    const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
    const dbName = 'restaurant_db'; // Replace with your database name

    const menuItems = [
        { id: 1, items: ['Pizza', 'Burger'], total: 18 },
        { id: 2, items: ['Salad'], total: 6 },
        { id: 3, items: ['Pasta', 'Sandwich'], total: 14 },
        { id: 3, items: ['Pasta', 'Sandwich'], total: 14 },
        { id: 4, items: ['Steak', 'Fries'], total: 25 },
        { id: 5, items: ['Sushi'], total: 12 },
        { id: 6, items: ['Chicken Parmesan', 'Caesar Salad'], total: 20 },
        { id: 7, items: ['Fish Tacos', 'Guacamole'], total: 15 },
        { id: 8, items: ['BBQ Ribs', 'Cornbread'], total: 30 },
        { id: 9, items: ['Pad Thai', 'Spring Rolls'], total: 16 },
        { id: 10, items: ['Margarita Pizza'], total: 10 },
        { id: 11, items: ['Hamburger', 'French Fries'], total: 13 },
        { id: 12, items: ['Caesar Salad', 'Garlic Bread'], total: 8 },
        { id: 13, items: ['Lasagna', 'Tiramisu'], total: 22 },
        { id: 14, items: ['Pho', 'Vietnamese Spring Rolls'], total: 18 },
        { id: 15, items: ['Sashimi', 'Edamame'], total: 24 },
        { id: 16, items: ['Chicken Tikka Masala', 'Naan'], total: 19 },
        { id: 17, items: ['Shrimp Scampi', 'Caprese Salad'], total: 28 },
        { id: 18, items: ['Burrito', 'Chips and Salsa'], total: 12 },
        { id: 19, items: ['Ramen', 'Gyoza'], total: 17 },
        { id: 20, items: ['Lobster Roll'], total: 32 },
        { id: 21, items: ['Philly Cheesesteak', 'Onion Rings'], total: 21 },
        { id: 22, items: ['Greek Salad', 'Pita Bread'], total: 14 },
        { id: 23, items: ['BBQ Chicken Pizza'], total: 16 },
        { id: 24, items: ['Taco Salad', 'Quesadilla'], total: 18 },
        { id: 25, items: ['Beef Wellington', 'Mashed Potatoes'], total: 35 },
        { id: 26, items: ['Shrimp Pad Thai', 'Thai Iced Tea'], total: 20 },
        { id: 27, items: ['Falafel Wrap', 'Hummus'], total: 13 },
        { id: 28, items: ['Seafood Paella'], total: 27 },
        { id: 29, items: ['Philly Burger', 'Sweet Potato Fries'], total: 19 },
        { id: 30, items: ['Vegetarian Pizza', 'Caesar Salad'], total: 23 },
        { id: 31, items: ['Club Sandwich', 'French Onion Soup'], total: 15 },
        { id: 32, items: ['Beef Tacos', 'Mexican Rice'], total: 14 },
        { id: 33, items: ['Chicken Alfredo', 'Garlic Knots'], total: 21 },
        { id: 34, items: ['Vegetable Stir Fry', 'Egg Rolls'], total: 18 },
        { id: 35, items: ['Crispy Duck', 'Spring Onion Pancakes'], total: 30 },
        { id: 36, items: ['Calamari', 'Bruschetta'], total: 17 },
        { id: 37, items: ['Shakshuka', 'Hummus'], total: 16 },
        { id: 38, items: ['Sushi Platter', 'Miso Soup'], total: 28 },
        { id: 39, items: ['Pulled Pork Sandwich', 'Cole Slaw'], total: 12 },
        { id: 40, items: ['Vegan Burrito', 'Guacamole'], total: 15 },
        { id: 41, items: ['Tom Yum Soup', 'Green Curry'], total: 19 },
        { id: 42, items: ['Fish and Chips'], total: 14 },
        { id: 43, items: ['Mushroom Risotto', 'Caesar Salad'], total: 24 },
        { id: 44, items: ['Chicken Shawarma Wrap', 'Tabbouleh'], total: 16 },
        { id: 45, items: ['Beef Brisket', 'Cornbread'], total: 26 },
        { id: 46, items: ['Spinach and Ricotta Ravioli', 'Garlic Bread'], total: 21 },
        { id: 47, items: ['Peking Duck', 'Steamed Buns'], total: 32 },
        { id: 48, items: ['Szechuan Chicken', 'Fried Rice'], total: 18 },
        { id: 49, items: ['Caprese Pizza', 'Mixed Green Salad'], total: 20 },
        { id: 50, items: ['Crab Cakes', 'Remoulade Sauce'], total: 29 },
        { id: 51, items: ['Vegetarian Sushi Roll', 'Miso Soup'], total: 15 },
        { id: 52, items: ['BBQ Pulled Chicken Sandwich', 'Sweet Potato Fries'], total: 17 },
        { id: 53, items: ['Vegetable Curry', 'Basmati Rice'], total: 18 },
        { id: 54, items: ['Turkey Burger', 'Onion Rings'], total: 13 },
        { id: 55, items: ['Steamed Lobster', 'Drawn Butter'], total: 36 },
        { id: 56, items: ['Tofu Stir Fry', 'Spring Rolls'], total: 16 },
        { id: 57, items: ['Eggplant Parmesan', 'Garlic Knots'], total: 20 },
        { id: 58, items: ['Carnitas Tacos', 'Mexican Street Corn'], total: 14 },
        { id: 59, items: ['Spaghetti Carbonara', 'Caesar Salad'], total: 22 },
        { id: 60, items: ['Grilled Cheese Sandwich', 'Tomato Soup'], total: 11 },
        { id: 61, items: ['Chicken Teriyaki Bowl', 'Edamame'], total: 18 },
        { id: 62, items: ['Beef Bulgogi', 'Kimchi'], total: 25 },
        { id: 63, items: ['Pad See Ew', 'Thai Iced Tea'], total: 17 },
        { id: 64, items: ['Lamb Gyro', 'Greek Salad'], total: 19 },
        { id: 65, items: ['Shrimp Linguine', 'Garlic Bread'], total: 24 },
        { id: 66, items: ['Beef Pho', 'Vietnamese Coffee'], total: 21 },
        { id: 67, items: ['Hawaiian Pizza'], total: 12 },
        { id: 68, items: ['Chicken Quesadilla', 'Salsa'], total: 14 },
        { id: 69, items: ['Falafel Plate', 'Tzatziki'], total: 16 },
        { id: 70, items: ['Seafood Chowder', 'Oyster Crackers'], total: 18 },
        { id: 71, items: ['Pork Schnitzel', 'German Potato Salad'], total: 23 },
        { id: 72, items: ['Vegetable Tempura', 'Udon Soup'], total: 20 },
        { id: 73, items: ['Pulled Beef Sandwich', 'Cole Slaw'], total: 15 },
        { id: 74, items: ['Chicken Caesar Wrap', 'Potato Chips'], total: 13 },
        { id: 75, items: ['Sesame Chicken', 'Fried Rice'], total: 17 },
        { id: 76, items: ['Vegetarian Chili', 'Cornbread'], total: 16 },
        { id: 77, items: ['Beef Tacos', 'Refried Beans'], total: 12 },
        { id: 78, items: ['Vegetable Pad Thai', 'Spring Rolls'], total: 18 },
        { id: 79, items: ['Lobster Mac and Cheese'], total: 32 },
        { id: 80, items: ['Chicken Satay', 'Peanut Sauce'], total: 19 },
        { id: 81, items: ['Gyro Plate', 'Greek Salad'], total: 21 },
        { id: 82, items: ['Butter Chicken', 'Naan'], total: 24 },
        { id: 83, items: ['Banh Mi Sandwich', 'Vietnamese Iced Coffee'], total: 15 },
        { id: 84, items: ['Crab Rangoon', 'Hot and Sour Soup'], total: 18 },
        { id: 85, items: ['Beef Empanadas', 'Chimichurri Sauce'], total: 16 },
        { id: 86, items: ['Vegetarian Moussaka', 'Greek Salad'], total: 23 },
        { id: 87, items: ['Pork Belly Bao Buns', 'Pickled Cucumber'], total: 20 },
        { id: 88, items: ['Chicken Shawarma Plate', 'Hummus'], total: 17 },
        { id: 89, items: ['Shrimp and Grits'], total: 28 },
        { id: 90, items: ['Vegetarian Pho', 'Spring Rolls'], total: 15 },
        { id: 91, items: ['Pulled Jackfruit Sandwich', 'Slaw'], total: 14 },
        { id: 92, items: ['Pasta Primavera', 'Garlic Bread'], total: 19 },
        { id: 93, items: ['Vegetable Sushi Roll', 'Miso Soup'], total: 13 },
        { id: 94, items: ['BBQ Brisket', 'Cornbread'], total: 26 },
        { id: 95, items: ['Veggie Wrap', 'Sweet Potato Fries'], total: 15 }
    ];

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect(); // Connect to MongoDB

        const db = client.db(dbName); // Select the database

        const menuCollection = db.collection('menu'); // Select the collection

        // Insert menu items into the collection
        const result = await menuCollection.insertMany(menuItems);
        console.log(`${result.insertedCount} menu items inserted successfully.`);
    } finally {
        await client.close(); // Close the MongoDB client
    }
}

// Call the function to insert menu items
insertMenuItems().catch(console.error);

// Middleware to set device-id header if not present
app.use('/api', (req, res, next) => {
    if (!req.headers['device-id']) {
        req.headers['device-id'] = generateUUID();
    }
    next();
}, routes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
