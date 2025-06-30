<?php
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri); // Default local MongoDB URL

$db = $client->green_link; // Replace 'green_link' with your actual database name
?>