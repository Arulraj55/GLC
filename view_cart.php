<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>View Cart</title>
  <style>
    /* Basic Styles for Cart View */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 10px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .cart-item p {
      margin: 0;
      padding: 5px;
    }
  </style>
</head>
<body>
  <h2>Your Cart</h2>
  <div id="cartContainer"></div>

  <script>
    fetch('https://glc-hjb2.onrender.com/get_cart.php') // Fetch cart data from the backend
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('cartContainer');
        if (data.cart.length > 0) {
          data.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
              <p>${item.product} - ₹${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
            `;
            container.appendChild(cartItem);
          });
        } else {
          container.innerHTML = '<p>Your cart is empty.</p>';
        }
      });
  </script>
</body>
</html>