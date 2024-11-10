<?php
require_once 'db.php';


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
