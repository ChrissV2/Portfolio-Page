<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "./PHPmailer/src/Exception.php";
require "./PHPmailer/src/PHPMailer.php";
require "./PHPmailer/src/SMTP.php";


    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "polski936@gmail.com"; 
    $mail->Password = "emce gpat sozj pmmz";
    $mail->SMTPSecure = "ssl";
    $mail->Port = 465;

    $mail->setFrom($_POST["email"]);

    $mail->addAddress("polski936@gmail.com");

    $senderEmail = $_POST['email'];          
    $name = $_POST['name'];         
    $message = $_POST['message'];   

    $mail->isHTML(true);
    $mail->setLanguage('pl', './phpmailer/language/');
    $mail->CharSet = 'UTF-8';


    $mail->Subject = 'Wiadomość wysłana z formularza ze Strony CHRMedia';
    $mail->Body = "E-mail od: $senderEmail<br>Imię i nazwisko: $name<br><br>$message";


    if ($mail->send()) {
        header("Location: /index.html?mail_status=sent#contact");
    } else {
        header("Location: /index.html?mail_status=error");
    }

?>