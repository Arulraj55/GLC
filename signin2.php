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
    echo "<script>alert('All fields are required!'); window.location.href='signin2.html';</script>";
    exit;
}

// Find the user
$user = $userCollection->findOne(['username' => $username]);

if (!$user) {
    echo "<script>alert('Invalid username or password.'); window.location.href='signin2.html';</script>";
    exit;
}

// Now verify the password
if (password_verify($password, $user['password'])) {
    $_SESSION['username'] = $username;
    header("Location: https://glc-hjb2.onrender.com/index1.php");
    exit();
} else {
    echo "<script>alert('Invalid username or password.'); window.location.href='signin2.html';</script>";
    exit();
}
?>