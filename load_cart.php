<?php
session_start();
require 'vendor/autoload.php';

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->GreenLink->Cart;

$username = $_SESSION['username']; // or $_SESSION['shop_username']

$items = $collection->find(['username' => $username]);

$cartItems = [];

foreach ($items as $item) {
    $cartItems[] = [
        'productName' => $item['productName'],
        'productImage' => $item['productImage'],
        'price' => $item['price']
    ];
}

echo json_encode($cartItems);
?>