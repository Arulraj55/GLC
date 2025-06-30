<?php
session_start();

// Ensure user is signed in, otherwise redirect to signin page
if (!isset($_SESSION['username'])) {
    header("Location: signin1.html");
    exit();
}

$username = $_SESSION['username']; // Optional: use this to personalize if needed
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop & Farmer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url("GLC6.jpg") no-repeat center center/cover;
            color: white;
            position: relative;
        }

        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.65);
            z-index: -1;
        }

        .container {
            display: flex;
            gap: 5vw;
            justify-content: center;
            align-items: center;
        }

        .card {
            width: 350px;
            height: 450px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.3);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s, box-shadow 0.3s;
            background: rgba(0, 0, 0, 0.8);
        }

        .card:hover {
            transform: scale(1.05);
            box-shadow: 0px 10px 20px rgba(255, 255, 255, 0.5);
        }

        .card .image {
            height: 65%;
            background-size: cover;
            background-position: center;
        }

        .shop-owner {
            background-image: url("frontend/GLC2.jpg");
            border-bottom: 3px solid gold;
        }

        .farmer {
            background-image: url("frontend/GLC3.jpg");
            border-bottom: 3px solid gold;
        }

        .card .content {
            padding: 1.5vw;
            text-align: center;
            font-size: 1.04vw;
        }

        .card h2 {
            margin-bottom: 1vw;
            font-size: 1.8em;
            color: gold;
        }

        .btn {
            display: inline-block;
            margin-top: 1vw;
            padding: 0.8vw 1.5vw;
            border-radius: 5px;
            background: gold;
            color: black;
            font-weight: bold;
            text-decoration: none;
            transition: background 0.3s;
        }

        .btn:hover {
            background: darkorange;
        }

        @media (max-width: 768px) {
            .container {
                flex-direction: column;
                gap: 3vw;
            }

            .card {
                width: 80%;
                height: auto;
            }

            .card .image {
                height: 50%;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Buy from Farmer -->
        <div class="card">
            <div class="image shop-owner"></div>
            <div class="content">
                <h2>Buy from Farmer</h2>
                <p>Browse farm goods. Compare best rates. Buy fresh items. Get quick delivery. Track past orders.
                    Choose local sellers. Secure easy payments. Support farmers well. Shop with ease. Enjoy fresh deals.</p>
                <a href="buy.html" class="btn">Buy Now</a>
            </div>
        </div>

        <!-- Shop Owner -->
        <div class="card">
            <div class="image farmer"></div>
            <div class="content">
                <h2>Shop Owner</h2>
                <p>Update store stock. Set best prices. Manage inventory. Track daily sales. List fresh products. Receive farmer orders. 
                    Grow business fast. Offer great deals. Improve shop reach. Boost customer trust.</p>
                <a href="https://glc-hjb2.onrender.com/shop_dashboard.php" class="btn">Update Now</a>
            </div>
        </div>
    </div>

</body>
</html>