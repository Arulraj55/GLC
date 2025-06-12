<?php
require 'vendor/autoload.php'; // This comes from Composer

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
$client = new MongoDB\Client($uri); // Default local MongoDB URL

$db = $client->green_link; // Replace 'green_link' with your actual database name
?>