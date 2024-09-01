<?php

$servername = "localhost";
$username = "root"; // Adjust accordingly
$password = ""; // Adjust accordingly
$dbname = "list_manager";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
