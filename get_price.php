<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productName = $_POST["product"];

    // Connect to MongoDB
    require __DIR__ . '/vendor/autoload.php'; 
    $uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
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