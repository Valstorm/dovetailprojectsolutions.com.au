<?php
       // from the form
       $name = trim(strip_tags($_POST['contact_name']));
       $phone = trim(strip_tags($_POST['contact_phone']));
       $email = trim(strip_tags($_POST['contact_email']));
       $message = htmlentities($_POST['contact_message']);

       // set here
       $subject = "New message from dovetailprojectsolutions.com.au";
       $to = "thirdcache@gmail.com";

       $body = "Name: $name \r\nPhone: $phone\r\nEmail: $email\r\n\n$message";

       $headers = "From: $email \r\n";
       $headers .= "Reply-To: $email \r\n";
       $headers .= "Return-Path: $email\r\n";
       $headers .= "X-Mailer: PHP \r\n";

       // send the email
       mail($to, $subject, $body, $headers);

       // redirect afterwords, if needed
       header('Location: thanks.html#contact');
?>