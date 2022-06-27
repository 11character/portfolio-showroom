<?php
    include './api-login-check.php';
    include '../db.php';

    $page_text_ko = [
        'bottom1' => '',
        'bottom2' => ''
    ];

    $page_text_en = [
        'bottom1' => '',
        'bottom2' => ''
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