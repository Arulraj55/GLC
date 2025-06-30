<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

$username = $_POST['username'];
$password = $_POST['password'];

$user = $collection->findOne(['username' => $username, 'password' => $password]);

if ($user) {
    $_SESSION['username'] = $username;
    header("Location: https://glc-hjb2.onrender.com/dashboard.php");
    exit;
} else {
    echo "Invalid credentials.";
}
?>