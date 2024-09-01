<?php
$servername = "localhost";
$username = "root"; // Adjust accordingly
$password = ""; // Adjust accordingly
$dbname = "list_manager";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM lists";
$result = $conn->query($sql);

$lists = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $lists[] = $row;
    }
}

echo json_encode($lists);

$conn->close();
?>
