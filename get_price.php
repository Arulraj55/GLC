<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productName = $_POST["product"];

    // Connect to MongoDB
    require 'vendor/autoload.php'; // if you installed MongoDB extension with Composer
    $uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
    $client = new MongoDB\Client($uri);

    // Select your database and collection
    $collection = $client->greenlink->prices; // Make sure this matches the collection name you used

    // Find product by name (use 'product' instead of 'name')
    $product = $collection->findOne(["product" => $productName]);

    if ($product) {
        echo json_encode(["price" => $product["price"]]);
    } else {
        echo json_encode(["price" => "Price not found"]);
    }
}
?>