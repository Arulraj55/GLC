<?php
session_start();
require 'vendor/autoload.php';

<<<<<<< HEAD
$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
=======
$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
>>>>>>> cfb9cd9582638246f461bccb56611f93f59f073c
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

// Getting form data
$username = trim($_POST['username']);
$email = $_POST['email'];
$password = $_POST['password']; // NO hashing
$phone = $_POST['phone'];
$address = $_POST['address'];

// Check if user already exists
$existingUser = $collection->findOne(['username' => $username]);
if ($existingUser) {
    echo "<script>alert('Username already exists. Please choose another.'); window.location.href='signup.html';</script>";
    exit();
}

// Insert new user
$products = [];
for ($i = 1; $i <= 16; $i++) {
    $products[] = [
        'name' => "Product $i",
        'image' => "product$i.jpg"
    ];
}

$collection->insertOne([
    'username' => $username,
    'email' => $email,
    'password' => $password, // Stored directly without hashing
    'phone' => $phone,
    'address' => $address,
    'products' => $products
]);

$_SESSION['username'] = $username;
header("Location: dashboard.php");
exit();
?>