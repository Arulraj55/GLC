<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
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