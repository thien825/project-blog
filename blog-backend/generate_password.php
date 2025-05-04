<?php
$newPassword = 'newpassword123';
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
echo $hashedPassword;
?>