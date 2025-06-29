<?php
require 'vendor/autoload.php';

try {
<<<<<<< HEAD
  $uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
=======
  $uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
>>>>>>> cfb9cd9582638246f461bccb56611f93f59f073c
  $client = new MongoDB\Client($uri);
  $db = $client->green_link;
  echo "Connected to MongoDB successfully!";
} catch (Exception $e) {
  echo "Error connecting to MongoDB: " . $e->getMessage();
}
?>