<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

// Get login form data
$username = trim($_POST['username']);
$password = $_POST['password'];

// Find user by username and password (plain text)
$user = $collection->findOne(['username' => $username, 'password' => $password]);

if (!$user) {
    echo "<script>alert('Invalid username or password.'); window.location.href='signin.html';</script>";
    exit();
}

$_SESSION['username'] = $username;
header("Location: https://glc-hjb2.onrender.com/dashboard.php");
exit();
?>