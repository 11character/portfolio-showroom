<?php
    include './api-login-check.php';
    include '../db.php';

    $page_text_ko = [
        'bottom' => '(주)예술고래 상회(Artgorae Co) 대한민국 서울'
    ];

    $page_text_en = [
        'bottom' => '(주)예술고래 상회(Artgorae Co) Seoul, South Korea'
    ];

    $data = [
        'code' => 0,
        'message' => 'success',
        'data' => [
            'ko' => $page_text_ko,
            'en' => $page_text_en
        ]
    ];

    echo json_encode($data);
?>