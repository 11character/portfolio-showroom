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

            $insertValue = [
                NAME => $_POST['name'],
                DESCRIPTION => $_POST['description'],
                LINK => $_POST['link'],
                IMG_URL => '',
                BGM_URL => '',
                CONTENT_KO => $_POST['contentKo'],
                CONTENT_EN => $_POST['contentEn'],
                DATA => ''
            ];

            $pdo->prepare($sql_insert_tb_showroom)->execute($insertValue);

            // 이미지와 배경음악 파일이 있다면 저장 처리.
            if (!empty($_FILES['imgFile']) || !empty($_FILES['bgmFile'])) {
                try {
                    // 저장한 행 ID 값 확인을 위해 조회.
                    $selectValue = [
                        NAME => $_POST['name']
                    ];

                    $stmt = $pdo->prepare($sql_select_tb_showroom_from_name);

                    if ($stmt->execute($selectValue)) {
                        $arr = [];

                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            $arr[] = $row;
                        }

                        $row = $arr[count($arr) - 1];
                        $dir_path = $SHOWROOM_FILE_DIR_PATH . '/' . $row['SEQ_ID'];

                        // 디렉토리를 만든다.
                        if (!is_dir($dir_path)) {
                            mkdir($dir_path, 0777, true);
                        }

                        // 이미지 파일 저장.
                        if (!empty($_FILES['imgFile'])) {
                            $img_file = $_FILES['imgFile'];
                            $ext = pathinfo($img_file['name'])['extension'];

                            move_uploaded_file($img_file['tmp_name'], $dir_path . '/img.' . $ext);

                            $row['IMG_URL'] = $SHOWROOM_FILE_DIR . '/' . $row['SEQ_ID'] . '/img.' . $ext;
                        }

                        // 배경음 파일 저장.
                        if (!empty($_FILES['bgmFile'])) {
                            $bgm_file = $_FILES['bgmFile'];
                            $ext = pathinfo($bgm_file['name'])['extension'];

                            move_uploaded_file($bgm_file['tmp_name'], $dir_path . '/bgm.' . $ext);

                            $row['BGM_URL'] = $SHOWROOM_FILE_DIR . '/' . $row['SEQ_ID'] . '/bgm.' . $ext;
                        }

                        $updateValue = [
                            SEQ_ID => $row['SEQ_ID'],
                            NAME => $row['NAME'],
                            DESCRIPTION => $row['DESCRIPTION'],
                            IMG_URL => $row['IMG_URL'],
                            BGM_URL => $row['BGM_URL'],
                            CONTENT_KO => $row['CONTENT_KO'],
                            CONTENT_EN => $row['CONTENT_EN'],
                            DATA => $_POST['DATA']
                        ];

                        $pdo->prepare($sql_update_tb_showroom)->execute($updateValue);

                        $data['code'] = 0;
                        $data['message'] = 'success';
                    }

                } catch(Exception $e) {
                    $data['code'] = 98;

                    if ($return_db_error) {
                        $data['message'] = $e->getMessage();
                    }
                }

            } else {
                // 파일 없이 완료.
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