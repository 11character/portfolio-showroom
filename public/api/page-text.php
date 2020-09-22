<?php
    include './api-login-check.php';
    include '../db.php';

    $page_text_ko = [
        'bottom1' => '(주)예술고래 상회(Artgorae Co) 경기도 성남시 수정구 수정남로324번길 2, 401 사업자등록번호 240-81-00121 통신판매업등록번호: 제2015-경기성남-1233호 대표자:윤영빈',
        'bottom2' => 'Phone:+82.02.790.9322 Email:help@oaah.co.kr'
    ];

    $page_text_en = [
        'bottom1' => '(주)예술고래 상회(Artgorae Co) 경기도 성남시 수정구 수정남로324번길 2, 401 사업자등록번호 240-81-00121 통신판매업등록번호: 제2015-경기성남-1233호 대표자:윤영빈',
        'bottom2' => 'Phone:+82.02.790.9322 Email:help@oaah.co.kr'
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