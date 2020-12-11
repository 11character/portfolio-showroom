<?php
    include './api-login-check.php';
    include '../db.php';

    $page_text_ko = [
        'bottom1' => '후원: 문화체육관광부, 한국문화예술위원회, 서울문화재단',
        'bottom2' => 'Powered by ‘desk desk’'
    ];

    $page_text_en = [
        'bottom1' => 'Sponsor: Ministry of Culture, Sports and Tourism, Arts Council Korea, Seoul Foundation for Arts and Culture.',
        'bottom2' => 'Powered by ‘desk desk’'
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