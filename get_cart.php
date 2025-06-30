<?php
require __DIR__ . '/db_connect.php'; // Connect to MongoDB

$cursor = $db->cart->find([], ['sort' => ['timestamp' => -1]]);
$items = [];

foreach ($cursor as $doc) {
    $items[] = [
        'product' => $doc['product'] ?? '',
        'farmer' => $doc['farmer'] ?? '',
        'price' => (float)($doc['price'] ?? 0), // Ensure price is float
        'image' => $doc['image'] ?? 'default.jpg'
    ];
}
echo json_encode($items);
?>