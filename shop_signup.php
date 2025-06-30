<?php
session_start();

// Get form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];

    // Hash the password securely
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Connect to MongoDB
    require __DIR__ . '/vendor/autoload.php';
    $uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
    $client = new MongoDB\Client($uri);
    $collection = $client->green_link->shop_owners;

    // Check if user already exists
    $existingUser = $collection->findOne(['username' => $username]);
    if ($existingUser) {
        echo "<script>alert('Username already exists. Try a different one.'); window.location.href='signup1.html';</script>";
        exit();
    }

    // Insert new shop owner
    $insertResult = $collection->insertOne([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,  // Store hashed password
        'phone' => $phone,
        'address' => $address,
        'products' => []
    ]);

    // Store session and redirect
    $_SESSION['username'] = $username;
    header("Location: https://glc-hjb2.onrender.com/login1.php");
    exit();
}
?>