<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

// Connect to MongoDB
$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$collection = $client->green_link->shop_owners;

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo "<script>alert('Please enter both username and password'); window.location.href='signin1.html';</script>";
        exit();
    }

    // Find the shop owner by username
    $user = $collection->findOne(['username' => $username]);

    if ($user && password_verify($password, $user['password'])) {
        // Correct password -> login success
        $_SESSION['username'] = $username;
        header("Location: https://glc-hjb2.onrender.com/login1.php"); // Redirect to dashboard or another page after login
        exit();
    } else {
        // Invalid username or password
        echo "<script>alert('Invalid username or password'); window.location.href='signin1.html';</script>";
        exit();
    }
}
?>