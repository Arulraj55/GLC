<?php
require 'vendor/autoload.php';

try {
  $uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
  $client = new MongoDB\Client($uri);
  $db = $client->green_link;
  echo "Connected to MongoDB successfully!";
} catch (Exception $e) {
  echo "Error connecting to MongoDB: " . $e->getMessage();
}
?>