<?php
header("Content-Type: application/json");
require "db.php";

$rows = [];

$q = $conn->query("SELECT name, destination, travel_date, phone FROM bookings ORDER BY id DESC");

while($row = $q->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);
