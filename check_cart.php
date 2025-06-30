<?php
require __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/";
$client = new MongoDB\Client($uri);
$db = $client->green_link;
$cart = $db->carts;

$all = $cart->find();

foreach ($all as $doc) {
    echo "<pre>";
    print_r($doc);
    echo "</pre>";
}
?>