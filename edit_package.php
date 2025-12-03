<?php
header("Content-Type: application/json");

require "db.php";

$id = $_POST["id"] ?? null;
$title = $_POST["title"] ?? "";
$image = $_POST["image"] ?? "";
$price = $_POST["price"] ?? "";
$desc  = $_POST["description"] ?? "";

if (!$id) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare(
  "UPDATE packages SET title=?, image=?, price=?, description=? WHERE id=?"
);

$stmt->bind_param("ssdsi", $title, $image, $price, $desc, $id);
$stmt->execute();

echo json_encode(["success" => true]);
exit;
