<?php
require __DIR__ . '/vendor/autoload.php';

try {
  $uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
  $client = new MongoDB\Client($uri);
  $db = $client->green_link;
  echo "Connected to MongoDB successfully!";
} catch (Exception $e) {
  echo "Error connecting to MongoDB: " . $e->getMessage();
}
?>