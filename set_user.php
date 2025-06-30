<?php
session_start();
if (isset($_SESSION['username'])) {
    echo "<script>
      localStorage.setItem('username', '" . $_SESSION['username'] . "');
      window.location.href = 'https://glc-hjb2.onrender.com/index1.html';
    </script>";
    exit();
} else {
    header("Location: https://glc-hjb2.onrender.com/signin2.html");
    exit();
}
?>