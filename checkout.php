<?php
session_start();
$username = $_SESSION['username'] ?? '';
?>

<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
</head>
<body style="text-align:center; font-family:Arial; padding-top:50px;">
  <h2>Checkout</h2>
  <?php if ($username): ?>
    <p>Thank you, <strong><?php echo $username; ?></strong>! Your order has been placed.</p>
  <?php else: ?>
    <p>Please sign in to proceed with checkout.</p>
  <?php endif; ?>
</body>
</html>