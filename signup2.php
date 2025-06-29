<?php
session_start();
require 'vendor/autoload.php';

<<<<<<< HEAD
$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
=======
$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
>>>>>>> cfb9cd9582638246f461bccb56611f93f59f073c
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$userCollection = $db->users;

// Get POST data
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';

// Validate inputs
if (empty($username) || empty($password) || empty($email) || empty($phone) || empty($address)) {
    echo "All fields are required!";
    exit;
}

// Check if username already exists
$userExists = $userCollection->findOne(['username' => $username]);

if ($userExists) {
    echo "Sign up failed. Try a different username.";
    exit;
}

// Hash the password (for security)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user into the database
$newUser = [
    'username' => $username,
    'password' => $hashedPassword,
    'email' => $email,
    'phone' => $phone,
    'address' => $address
];

$insertResult = $userCollection->insertOne($newUser);

if ($insertResult->getInsertedCount() > 0) {
    echo "success";
} else {
    echo "Sign up failed. Please try again.";
}
?>