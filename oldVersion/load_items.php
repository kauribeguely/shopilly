<?php
require_once 'db.php';


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
