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
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';

// Validate inputs
if (empty($username) || empty($password) || empty($email) || empty($phone) || empty($address)) {
    echo "<script>alert('All fields are required!'); window.location.href='signup2.html';</script>";
    exit;
}

// Check if username already exists
$userExists = $userCollection->findOne(['username' => $username]);
if ($userExists) {
    echo "<script>alert('Sign up failed. Try a different username.'); window.location.href='signup2.html';</script>";
    exit;
}

// Hash the password (for security)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user into the database
$newUser = [
    'username' => $username,
    'password' => $hashedPassword,
    'email' => $email,
    'phone' => $phone,
    'address' => $address
];

$insertResult = $userCollection->insertOne($newUser);

if ($insertResult->getInsertedCount() > 0) {
    $_SESSION['username'] = $username;
    header("Location: https://glc-hjb2.onrender.com/index1.php");
    exit();
} else {
    echo "<script>alert('Sign up failed. Please try again.'); window.location.href='signup2.html';</script>";
    exit();
}
?>