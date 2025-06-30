<?php
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$cart = $db->carts;

// Get the username from the query string
$username = isset($_GET['username']) ? $_GET['username'] : '';

// Fetch cart items from the database
$cartData = $cart->findOne(['username' => $username]);

// Check if cart data exists
if ($cartData) {
    $items = $cartData['items'];
} else {
    $items = [];
}

echo "
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <title>$username's Cart</title>
  <style>
    /* Your existing CSS for the cart page */
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .cart-container { max-width: 800px; margin: 30px auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); }
    h2 { text-align: center; color: seagreen; }
    .cart-item { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 15px 0; }
    .cart-item img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; margin-right: 15px; }
    .cart-details { flex-grow: 1; }
    .remove-btn { background: crimson; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; }
    .total { text-align: right; font-size: 20px; font-weight: bold; color: #333; margin-top: 20px; }
  </style>
</head>
<body>
  <div class='cart-container'>
    <h2>$username's Cart</h2>";

$total = 0;
foreach ($items as $item) {
  echo "
  <div class='cart-item'>
    <img src='{$item['image']}' /> <!-- Show product image -->
    <div class='cart-details'>
      <strong>{$item['product']}</strong><br/>
      ₹{$item['price']} - <em>{$item['shop']}</em>
    </div>
    <a href='https://glc-hjb2.onrender.com/remove_from_cart1.php?id={$item['_id']}&username=$username' class='remove-btn'>Remove</a>
  </div>";
  $total += $item['price'];
}

echo "<div class='total'>Total: ₹$total</div></div></body></html>";
?>