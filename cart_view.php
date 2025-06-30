<?php
session_start();
require __DIR__ . '/vendor/autoload.php';

$username = $_SESSION['username'] ?? '';

// Ensure the user is logged in
if (!$username) {
  echo "<script>alert('Please sign in first.'); window.location.href = 'signin2.html';</script>";
  exit;
}

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$users = $db->users;
$cartCollection = $db->carts;

// Get user ID from the database
$user = $users->findOne(['username' => $username]);
if (!$user) {
    echo "<script>alert('User not found.'); window.location.href = 'signin2.html';</script>";
    exit;
}
$user_id = $user['_id'];

// Fetch the user's cart
$cart = $cartCollection->findOne(['user_id' => $user_id]);
$cartItems = $cart['items'] ?? [];
?>

<!DOCTYPE html>
<html>
<head>
  <title>Your Cart</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      background-color: #f3f3f3;
      padding-bottom: 100px;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-top: 30px;
    }

    .welcome {
      text-align: center;
      color: #34495e;
      font-size: 20px;
    }

    .cart-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      padding: 30px;
    }

    .cart-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      width: 280px;
      padding: 20px;
      text-align: center;
    }

    .cart-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
    }

    .cart-card h3 {
      margin: 10px 0 5px;
      font-size: 20px;
      color: #2c3e50;
    }

    .cart-card p {
      margin: 5px 0;
      font-size: 16px;
      color: #555;
    }

    .remove-button {
      margin-top: 10px;
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .remove-button:hover {
      background-color: #c0392b;
    }

    .total {
      text-align: center;
      font-size: 22px;
      color: #2c3e50;
      margin-top: 30px;
    }

    .checkout-btn {
      display: block;
      margin: 20px auto;
      background-color: #27ae60;
      color: white;
      padding: 12px 24px;
      font-size: 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
    }

    .checkout-btn:hover {
      background-color: #1e8449;
    }
  </style>
</head>
<body>

<h2>Your Cart</h2>
<div class="welcome">
  Welcome, <strong><?php echo htmlspecialchars($username); ?></strong>!
</div>

<div class="cart-container">
<?php
$total = 0;
$hasItems = count($cartItems) > 0;

foreach ($cartItems as $item) {
  $total += $item['price'];

  echo '<div class="cart-card">';
  echo '<img src="' . $item['image'] . '" alt="Product">';
  echo '<h3>' . $item['product'] . '</h3>';
  echo '<p>Shop: ' . $item['shop'] . '</p>';
  echo '<p>Price: ₹' . $item['price'] . '</p>';
  echo '<form method="POST" action="https://glc-hjb2.onrender.com/remove_from_cart1.php">';
  echo '<input type="hidden" name="username" value="' . $username . '">';
  echo '<input type="hidden" name="product" value="' . $item['product'] . '">';
  echo '<input type="hidden" name="shop" value="' . $item['shop'] . '">';
  echo '<button class="remove-button" type="submit">Remove</button>';
  echo '</form>';
  echo '</div>';
}
?>
</div>

<?php if ($hasItems): ?>
  <div class="total">Total: ₹<?php echo $total; ?></div>
  <a class="checkout-btn" href="https://glc-hjb2.onrender.com/checkout.php">Proceed to Checkout</a>
<?php else: ?>
  <div class="total">Your cart is empty.</div>
<?php endif; ?>

</body>
</html>