<?php
// Require the Composer autoload file to use MongoDB\Client
require 'vendor/autoload.php'; // Make sure this path is correct for your project

// Connect to the MongoDB server
<<<<<<< HEAD
$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
=======
$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
>>>>>>> cfb9cd9582638246f461bccb56611f93f59f073c
$client = new MongoDB\Client($uri); // Adjust if your MongoDB is hosted elsewhere

// Select the database and collection
$db = $client->green_link; // Adjust the database name if necessary
?>