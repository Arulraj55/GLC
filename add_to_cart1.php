<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$cartCollection = $db->carts;
$userCollection = $db->users;

// Get POST data (sanitize input to avoid potential issues)
$username = $_POST['username'] ?? ''; // Get username
$product = $_POST['product'] ?? ''; // Get product name
$shop = $_POST['shop'] ?? ''; // Get shop name
$image = $_POST['image'] ?? ''; // Get product image
$price = $_POST['price'] ?? ''; // Get product price

// Validate the input
if (!$username || !$product || !$image || !$price) {
    echo json_encode(['error' => 'Invalid request. Missing required fields.']);
    exit;
}

// Ensure price is a number (in case it's received as a string)
$price = floatval($price);

// Find the user in the users collection
$user = $userCollection->findOne(['username' => $username]);

// Check if the user exists
if (!$user) {
    echo json_encode(['error' => 'User not found.']);
    exit;
}

$user_id = $user['_id']; // Retrieve user ID

// Check if the user already has a cart
$cart = $cartCollection->findOne(['user_id' => $user_id]);

if ($cart) {
    // If the cart exists, add the product to the existing 'items' array
    $updateResult = $cartCollection->updateOne(
        ['user_id' => $user_id],
        [
            '$push' => [
                'items' => [
                    'product' => $product,
                    'shop' => $shop,
                    'image' => $image, // Store product image only
                    'price' => $price
                ]
            ]
        ]
    );

    // Check if update was successful
    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode(['message' => 'Product added to cart successfully.']);
    } else {
        echo json_encode(['error' => 'Failed to update cart.']);
    }
} else {
    // If no cart exists for the user, create a new cart document
    $insertResult = $cartCollection->insertOne([
        'user_id' => $user_id,
        'items' => [
            [
                'product' => $product,
                'shop' => $shop,
                'image' => $image, // Store product image only
                'price' => $price
            ]
        ]
    ]);

    // Check if insert was successful
    if ($insertResult->getInsertedCount() > 0) {
        echo json_encode(['message' => 'Product added to cart successfully.']);
    } else {
        echo json_encode(['error' => 'Failed to create cart.']);
    }
}

// Redirect to cart view (this is handled by AJAX in your frontend)
exit;
?>