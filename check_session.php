<?php
session_start();

// Assuming you're storing username in session after login
if (isset($_SESSION['username'])) {
  echo json_encode(['username' => $_SESSION['username']]);
} else {
  echo json_encode(['username' => null]);
}
?>