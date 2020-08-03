<?php
    include './api-login-check.php';
    include '../db.php';
    include './path.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    if (!empty($_POST)) {
        try {
            // 값 저장.
            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                SEQ_ID => $_POST['seqId'],
                NAME => $_POST['name'],
                DESCRIPTION => $_POST['description'],
                LINK => $_POST['link'],
                IMG_URL => $_POST['imgUrl'],
                BGM_URL => $_POST['bgmUrl'],
                CONTENT_KO => $_POST['contentKo'],
                CONTENT_EN => $_POST['contentEn'],
                DATA => $_POST['data']
            ];

            // 이미지와 배경음악 파일이 있다면 저장 처리.
            if (!empty($_FILES['imgFile']) || !empty($_FILES['bgmFile'])) {
                try {
                    $dir_path = $SHOWROOM_FILE_DIR_PATH . '/' . $value['SEQ_ID'];

                    // 디렉토리를 만든다.
                    if (!is_dir($dir_path)) {
                        mkdir($dir_path, 0777, true);
                    }

                    // 이미지 파일 저장.
                    if (!empty($_FILES['imgFile'])) {
                        $img_file = $_FILES['imgFile'];
                        $ext = pathinfo($img_file['name'])['extension'];

                        move_uploaded_file($img_file['tmp_name'], $dir_path . '/img.' . $ext);

                        // 파일 이름은 고정되어 있어서 값은 항상 같지만, 파일이 없었다가 추가되는 경우를 생각해서 새로 삽입.
                        $value['IMG_URL'] = $SHOWROOM_FILE_DIR . '/' . $value['SEQ_ID'] . '/img.' . $ext;
                    }

                    // 배경음 파일 저장.
                    if (!empty($_FILES['bgmFile'])) {
                        $bgm_file = $_FILES['bgmFile'];
                        $ext = pathinfo($bgm_file['name'])['extension'];

                        move_uploaded_file($bgm_file['tmp_name'], $dir_path . '/bgm.' . $ext);

                        // 파일 이름은 고정되어 있어서 값은 항상 같지만, 파일이 없었다가 추가되는 경우를 생각해서 새로 삽입.
                        $value['BGM_URL'] = $SHOWROOM_FILE_DIR . '/' . $value['SEQ_ID'] . '/bgm.' . $ext;
                    }

                } catch(Exception $e) {
                    $data['code'] = 98;

                    if ($return_db_error) {
                        $data['message'] = $e->getMessage();
                    }
                }
            }

            $pdo->prepare($sql_update_tb_showroom)->execute($value);

            // 파일 오류가 나지 않았다면 0 코드 반환.
            if ($data['code'] != 98) {
                $data['code'] = 0;
                $data['message'] = 'success';
            }

        } catch(Exception $e) {
            if ($return_db_error) {
                $data['message'] = $e->getMessage();
            }
        }
    }

    echo json_encode($data);
?>