<?php
header("Content-Type: application/json");

require "db.php";

$title = $_POST['title'] ?? "";
$image = $_POST['image'] ?? "";
$price = $_POST['price'] ?? "";
$desc  = $_POST['description'] ?? "";

if (!$title || !$image || !$price || !$desc) {
    echo json_encode([
        "success" => false,
        "error" => "Missing required data"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO packages (title,image,price,description)
     VALUES (?,?,?,?)"
);

$stmt->bind_param("ssds", $title, $image, $price, $desc);

$stmt->execute();

echo json_encode(["success" => true]);
exit;
