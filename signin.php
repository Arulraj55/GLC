<?php
session_start();
require 'vendor/autoload.php';

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->greenlink->farmers;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {
        echo "<script>alert('Please fill in all fields.'); window.location.href='signin.html';</script>";
        exit();
    }

    $user = $collection->findOne(['username' => $username]);

    if ($user) {
        if (isset($user['password']) && $password === $user['password']) { // Plain text comparison
            $_SESSION['username'] = $username;
            header("Location: dashboard.php");
            exit();
        } else {
            echo "<script>alert('Invalid password!'); window.location.href='signin.html';</script>";
            exit();
        }
    } else {
        echo "<script>alert('Invalid username!'); window.location.href='signin.html';</script>";
        exit();
    }
} else {
    echo "<script>alert('Invalid request.'); window.location.href='signin.html';</script>";
    exit();
}
?>