<?php
require __DIR__ . '/db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);
$product = $data['product'] ?? '';
$farmer = $data['farmer'] ?? '';

if ($product && $farmer) {
    $db->cart->deleteOne(['product' => $product, 'farmer' => $farmer]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>