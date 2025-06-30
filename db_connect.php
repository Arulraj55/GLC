<?php
require 'https://glc-hjb2.onrender.com/vendor/autoload.php'; // This comes from Composer

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri); // Default local MongoDB URL

$db = $client->green_link; // Replace 'green_link' with your actual database name
?>