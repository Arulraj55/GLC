<?php
session_start();

// Get form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];

    // Hash the password securely
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Connect to MongoDB
    require 'vendor/autoload.php'; // make sure composer dependencies are installed
    $uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
    $client = new MongoDB\Client($uri);
    $collection = $client->green_link->shop_owners;

    // Check if user already exists
    $existingUser = $collection->findOne(['username' => $username]);
    if ($existingUser) {
        echo "<script>alert('Username already exists. Try a different one.'); window.location.href='signup1.html';</script>";
        exit();
    }

    // Insert new shop owner
    $insertResult = $collection->insertOne([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,  // Store hashed password
        'phone' => $phone,
        'address' => $address,
        'products' => []
    ]);

    // Store session and redirect
    $_SESSION['username'] = $username;
    header("Location: login1.php");
    exit();
}
?>