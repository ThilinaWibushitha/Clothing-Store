<?php

use Stripe\Billing\Alert;

require 'vendor/autoload.php';  // Load Composer's autoloader

// Check if the form is submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Create a MongoDB client
        $client = new MongoDB\Client;

        // Select the database and collection
        $myDatabase = $client->velvet;
        $collection = $myDatabase->empcollection;

        // Retrieve form data
        $firstName = $_POST['first-name'];
        $lastName = $_POST['last-name'];
        $address = $_POST['user-address'];
        $username = $_POST['user-username'];
        $email = $_POST['user-email'];
        $password = $_POST['user-password'];
        $confirmPassword = $_POST['confirm-password'];
        $role = $_POST['user-role'];

        // Check if passwords match
        if ($password !== $confirmPassword) {
            throw new Exception("Passwords do not match.");
        }

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert the user data into the database
        $collection->insertOne([
            'firstName' => $firstName,
            'lastName' => $lastName,
            'address' => $address,
            'username' => $username,
            'email' => $email,
            'password' => $hashedPassword,
            'role' => $role
        ]);
        echo '<script>
            alert("User registered successfully");
            window.location.href = "http://127.0.0.1:5500/login.html";
        </script>';
        exit();
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Invalid request method.";
}
