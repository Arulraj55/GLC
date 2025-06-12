<?php
require 'vendor/autoload.php';

$uri ="mongodb+srv://arulrajjebasingh:fpc6MjrhQqCYu9qW@cluster0.ze3oww2.mongodb.net/";
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