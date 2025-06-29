<?php
session_start();
require 'vendor/autoload.php';

<<<<<<< HEAD
$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
=======
$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
>>>>>>> cfb9cd9582638246f461bccb56611f93f59f073c
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