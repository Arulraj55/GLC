<?php
require __DIR__ . '/db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$product = $data['product'] ?? '';
$farmer = $data['farmer'] ?? '';
$price = $data['price'] ?? '';
$image = $data['image'] ?? 'default.jpg'; // Use image from frontend

if ($product && $farmer) {
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