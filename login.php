<?php
session_start();
require 'vendor/autoload.php';

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

$username = $_POST['username'];
$password = $_POST['password'];

$user = $collection->findOne(['username' => $username, 'password' => $password]);

if ($user) {
    $_SESSION['username'] = $username;
    header("Location: dashboard.php");
    exit;
} else {
    echo "Invalid credentials.";
}
?>