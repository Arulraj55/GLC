<?php
require __DIR__ . '/db_connect.php'; // Connect to MongoDB

$data = json_decode(file_get_contents("php://input"), true);

$product = $data['product'] ?? '';
$farmer = $data['farmer'] ?? '';
$price = $data['price'] ?? '';

if ($product && $farmer) {
    // Map correct images based on product name
    $productImageMapping = [
        'Carrot' => 'frontend/product1.jpg',
        'Tomato' => 'frontend/product2.jpg',
        'Potato' => 'frontend/product3.jpg',
        'Corn' => 'frontend/product4.jpg',
        'Cucumber' => 'frontend/product5.jpg',
        'Onion' => 'frontend/product6.jpg',
        'Garlic' => 'frontend/product7.jpg',
        'Lettuce' => 'frontend/product8.jpg',
        'Bell Pepper' => 'frontend/product9.jpg',
        'Broccoli' => 'frontend/product10.jpg',
        'Eggplant' => 'frontend/product11.jpg',
        'Green Pepper' => 'frontend/product12.jpg',
        'Spinach' => 'frontend/product13.jpg',
        'Beetroot' => 'frontend/product14.jpg',
        'Coriander' => 'frontend/product15.jpg',
        'Cabbage' => 'frontend/product16.jpg'
    ];

    $image = $productImageMapping[$product] ?? 'default.jpg';

    $collection = $db->cart;

    $insertResult = $collection->insertOne([
        'product' => $product,
        'farmer' => $farmer,
        'image' => $image,
        'price' => $price,
        'timestamp' => new MongoDB\BSON\UTCDateTime()
    ]);

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Missing product or farmer']);
}
?>