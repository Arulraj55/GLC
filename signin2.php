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

if (empty($username) || empty($password)) {
    echo "All fields are required!";
    exit;
}

// Find the user
$user = $userCollection->findOne(['username' => $username]);

if (!$user) {
    echo "Invalid username or password.";
    exit;
}

// Now verify the password
if (password_verify($password, $user['password'])) {
    // Password correct
    $_SESSION['username'] = $username;
    echo "success"; // Send 'success' to JS
} else {
    // Password wrong
    echo "Invalid username or password.";
}
?>