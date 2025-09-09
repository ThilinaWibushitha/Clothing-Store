<?php
session_start(); // Start session to check if the user is logged in

require 'vendor/autoload.php'; // Include Composer's autoloader
use MongoDB\Client;
use MongoDB\BSON\ObjectId;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");
$database = $client->selectDatabase('velvet');
$collection = $database->selectCollection('empcollection');

// Handle POST requests for delete and update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);
    $objectId = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

    // Check if ID is provided
    if (empty($objectId)) {
        die("User ID is required.");
    }

    // If action is delete
    if ($action === 'delete') {
        $collection->deleteOne(['_id' => new ObjectId($objectId)]);
        echo "<script>alert('User deleted successfully!'); window.location.href='admin.php';</script>";
    }
    // If action is update
    elseif ($action === 'update') {
        $firstName = filter_input(INPUT_POST, 'firstName', FILTER_SANITIZE_STRING);
        $lastName = filter_input(INPUT_POST, 'lastName', FILTER_SANITIZE_STRING);
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING);
        $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);

        $updatedData = [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $email,
            'address' => $address,
            'role' => $role
        ];

        $updateResult = $collection->updateOne(
            ['_id' => new ObjectId($objectId)],
            ['$set' => $updatedData]
        );

        if ($updateResult->getModifiedCount() > 0) {
            echo "<script>alert('User updated successfully!'); window.location.href='admin.php';</script>";
        } else {
            echo "<script>alert('No changes were made or user not found.');</script>";
        }
    }
}

// Fetch all users
$users = $collection->find();
?>

<!-- HTML Form for Display and Actions -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - User Management</title>
    <link rel="icon" type="image/png" href="./Assets/logo.png" />
    <link rel="stylesheet" href="../CSS/Main.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap"
        rel="stylesheet" />
</head>

<body>
    <div class="ad-container" id="admin-container">
        <h1 id="admin-header">Admin Dashboard</h1>
        <h2 id="user-header">Registered Users</h2>

        <!-- User Management Form -->
        <form action="admin.php" method="POST" id="admin-form">
            <table id="user-table">
                <thead>
                    <tr id="table-header">
                        <th id="first-name-header">First Name</th>
                        <th id="last-name-header">Last Name</th>
                        <th id="username-header">Username</th>
                        <th id="email-header">Email</th>
                        <th id="address-header">Address</th>
                        <th id="role-header">Role</th>
                        <th id="actions-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $user): ?>
                        <tr id="user-row-<?= htmlspecialchars((string)$user['_id']) ?>">
                            <td><input type="text" name="firstName" id="firstName_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars($user['firstName']) ?>" required></td>
                            <td><input type="text" name="lastName" id="lastName_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars($user['lastName']) ?>" required></td>
                            <td><input type="text" name="username" id="username_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars($user['username']) ?>" readonly></td>
                            <td><input type="email" name="email" id="email_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars($user['email']) ?>" required></td>
                            <td><input type="text" name="address" id="address_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars($user['address']) ?>" required></td>
                            <td>
                                <select name="role" id="role_<?= htmlspecialchars((string)$user['_id']) ?>">
                                    <option value="admin" <?= $user['role'] === 'admin' ? 'selected' : '' ?>>Admin</option>
                                    <option value="user" <?= $user['role'] === 'user' ? 'selected' : '' ?>>User</option>
                                </select>
                            </td>
                            <td>
                                <!-- Hidden ID Field -->
                                <input type="hidden" name="id" id="user-id_<?= htmlspecialchars((string)$user['_id']) ?>" value="<?= htmlspecialchars((string)$user['_id']) ?>">

                                <!-- Update Button -->
                                <button type="submit" name="action" class="btn_cover" value="update" id="update-btn_<?= htmlspecialchars((string)$user['_id']) ?>">Update</button>

                                <!-- Delete Button -->
                                <button type="submit" name="action" class="btn_cover" value="delete" id="delete-btn_<?= htmlspecialchars((string)$user['_id']) ?>" onclick="return confirm('Are you sure you want to delete this user?')">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </form>
    </div>
</body>

</html>