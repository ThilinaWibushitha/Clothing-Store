<?php
require 'vendor/autoload.php';  // MongoDB Library

// MongoDB connection
$client = new MongoDB\Client("mongodb://localhost:27017");
$db = $client->my_database;  // Connect to the 'taskManager' database
$collection = $db->my_collection;   // Access the 'tasks' collection
