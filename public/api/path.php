<?php
    // 이 파일이 있는 디렉토리 경로. (/api)
    $CURRENT_DIR = dirname(__FILE__);

    // 프로젝트의 루트 경로. (/)
    $ROOT_DIR = dirname($CURRENT_DIR);

    // 파일 루트 이름.
    $FILE_ROOT = 'data';

    // 모델 파일 디렉토리.
    $MODEL_FILE_DIR = $FILE_ROOT . '/model';

    // 모델 파일 디렉토리 절대경로.
    $MODEL_FILE_DIR_PATH = $ROOT_DIR . '/' . $MODEL_FILE_DIR;

    // 전지상 파일 디렉토리.
    $SHOWROOM_FILE_DIR = $FILE_ROOT . '/showroom';

    // 전지상 파일 디렉토리 절대경로.
    $SHOWROOM_FILE_DIR_PATH = $ROOT_DIR . '/' . $SHOWROOM_FILE_DIR;
?>