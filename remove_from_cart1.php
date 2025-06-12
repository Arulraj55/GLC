<?php
session_start();
require 'vendor/autoload.php';

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$cartCollection = $db->carts;

$username = $_POST['username'] ?? '';
$product = $_POST['product'] ?? '';
$shop = $_POST['shop'] ?? '';

if (empty($username) || empty($product) || empty($shop)) {
    echo "Invalid data.";
    exit;
}

// Find user ID
$user = $db->users->findOne(['username' => $username]);
if (!$user) {
    echo "User not found.";
    exit;
}
$user_id = $user['_id'];

// Remove the specific item from the user's cart
$updateResult = $cartCollection->updateOne(
    ['user_id' => $user_id],
    ['$pull' => ['items' => ['product' => $product, 'shop' => $shop]]]
);

if ($updateResult->getModifiedCount() > 0) {
    header("Location: cart_view.php"); // After removing, redirect to cart again
    exit;
} else {
    echo "Failed to remove item.";
}
?>