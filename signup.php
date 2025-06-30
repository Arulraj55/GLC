<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

// Get form data
$username = trim($_POST['username']);
$email = $_POST['email'];
$password = $_POST['password'];
$phone = $_POST['phone'];
$address = $_POST['address'];

// Check if user already exists
$existingUser = $collection->findOne(['username' => $username]);
if ($existingUser) {
    echo "<script>alert('Username already exists. Please choose another.'); window.location.href='signup.html';</script>";
    exit();
}

// Insert new user (plain password)
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
    'password' => $password, // plain text
    'phone' => $phone,
    'address' => $address,
    'products' => $products
]);

$_SESSION['username'] = $username;
header("Location: https://glc-hjb2.onrender.com/dashboard.php");
exit();
?>