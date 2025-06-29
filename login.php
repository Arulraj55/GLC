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