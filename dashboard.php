<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: signin.html");
    exit();
}

$username = $_SESSION['username'];
$products = [
    "Carrot", "Tomato", "Potato", "Corn",
    "Cucumber", "Onion", "Garlic", "Lettuce",
    "Bell Pepper", "Broccoli", "Eggplant", "Green Pepper",
    "Spinach", "Beetroot", "Coriander", "Cabbage"
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Farmer Dashboard</title>
  <style>
    body {
        background: #f0fff0;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
    }
    h1 {
        color: darkgreen;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }
    .product {
        border: 2px solid darkgreen;
        border-radius: 10px;
        padding: 10px;
        background: white;
        cursor: pointer;
        transition: 0.3s;
    }
    .product:hover {
        background: #dfffd6;
        transform: scale(1.05);
    }
    .product img {
        width: 100px;
        height: 100px;
    }
    #priceBox {
        margin-top: 30px;
        font-size: 24px;
        color: #444;
        background: #e6ffe6;
        border: 2px dashed green;
        padding: 20px;
        display: none;
    }
  </style>
</head>
<body>

<h1>Welcome, <?php echo htmlspecialchars($username); ?>!</h1>
<h2>Click a product to see the price</h2>

<div class="grid">
  <?php
    foreach ($products as $index => $product) {
        $img = "frontend/product" . ($index + 1) . ".jpg";
        echo "<div class='product' data-name='$product'>
                <img src='$img' alt='$product'>
                <p>$product</p>
              </div>";
    }
  ?>
</div>

<div id="priceBox"></div>

<script>
document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', () => {
        const name = product.getAttribute('data-name');

        fetch('https://glc-hjb2.onrender.com/get_price.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'product=' + encodeURIComponent(name)
        })
        .then(response => response.json())
        .then(data => {
            const box = document.getElementById('priceBox');
            box.innerHTML = `<strong>${name}:</strong> ${data.price}`;
            box.style.display = 'block';
        });
    });
});
</script>

</body>
</html>