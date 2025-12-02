<?php
require "db.php";

$id = $_POST["id"];
$title = $_POST["title"];
$image = $_POST["image"];
$price = $_POST["price"];
$desc = $_POST["description"];

$stmt = $conn->prepare(
"UPDATE packages SET title=?, image=?, price=?, description=? WHERE id=?"
);

$stmt->bind_param("ssdsi", $title, $image, $price, $desc, $id);

$stmt->execute();

echo json_encode(["success"=>true]);
