<?php
require __DIR__ . '/db_connect.php'; // Connect to MongoDB

$data = json_decode(file_get_contents("php://input"), true);

$product = $data['product'] ?? '';
$farmer = $data['farmer'] ?? '';
$price = $data['price'] ?? '';

if ($product && $farmer) {
    // Map correct images based on product name
    $productImageMapping = [
        'Carrot' => 'product1.jpg',
        'Tomato' => 'product2.jpg',
        'Potato' => 'product3.jpg',
        'Corn' => 'product4.jpg',
        'Cucumber' => 'product5.jpg',
        'Onion' => 'product6.jpg',
        'Garlic' => 'product7.jpg',
        'Lettuce' => 'product8.jpg',
        'Bell Pepper' => 'product9.jpg',
        'Broccoli' => 'product10.jpg',
        'Eggplant' => 'product11.jpg',
        'Green Pepper' => 'product12.jpg',
        'Spinach' => 'product13.jpg',
        'Beetroot' => 'product14.jpg',
        'Coriander' => 'product15.jpg',
        'Cabbage' => 'product16.jpg'
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