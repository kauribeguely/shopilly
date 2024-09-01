<?php
$servername = "localhost";
$username = "root"; // Default username for local servers
$password = ""; // Default password for local servers (leave empty if none)
$dbname = "list_manager";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $items = json_decode(file_get_contents('php://input'), true);

    // Clear existing items (optional, depending on your needs)
    $conn->query("TRUNCATE TABLE lists");

    // Insert each item into the database
    foreach ($items as $item) {
        $text = $conn->real_escape_string($item['text']);
        $completed = $item['completed'] ? 1 : 0;

        $sql = "INSERT INTO lists (item, completed) VALUES ('$text', '$completed')";

        if ($conn->query($sql) !== TRUE) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    echo "List saved successfully!";
}

$conn->close();
?>
