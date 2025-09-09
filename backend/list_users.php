<?php
require 'vendor/autoload.php';

use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->selectDatabase('velvet');
    $collection = $database->selectCollection('empcollection');

    $users = $collection->find();

    echo "Registered Users:\n";
    foreach ($users as $user) {
        echo "ID: " . $user['_id'] . "\n";
        echo "First Name: " . $user['firstName'] . "\n";
        echo "Last Name: " . $user['lastName'] . "\n";
        echo "Username: " . $user['username'] . "\n";
        echo "Email: " . $user['email'] . "\n";
        echo "Role: " . $user['role'] . "\n";
        echo "Password Hash: " . $user['password'] . "\n";
        echo "Address: " . $user['address'] . "\n";
        echo "------------------------\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
