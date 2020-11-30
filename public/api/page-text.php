<?php
    include './api-login-check.php';
    include '../db.php';

    $page_text_ko = [
        'bottom1' => 'Powered by ‘desk desk’ Website Copyright 2020. deskdesk all rights reserved www.deskdesk.kr'
    ];

    $page_text_en = [
        'bottom1' => 'Powered by ‘desk desk’ Website Copyright 2020. deskdesk all rights reserved www.deskdesk.kr'
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