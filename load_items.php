<?php
$servername = "localhost";
$username = "root"; // Adjust accordingly
$password = ""; // Adjust accordingly
$dbname = "list_manager";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$listId = $_GET['list_id'];

$sql = "SELECT * FROM list_items WHERE list_id = $listId";
$result = $conn->query($sql);

$items = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

echo json_encode($items);

$conn->close();
?>
