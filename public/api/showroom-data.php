<?php
    include '../db.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    try {
        $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $value = [
            SEQ_ID => $_GET['seqId']
        ];

        $stmt = $pdo->prepare($sql_select_tb_showroom_from_id);

        if ($stmt->execute($value)) {
            $arr = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $arr[] = $row;
            }

            $data['code'] = 0;
            $data['message'] = 'success';
            $data['data'] = $arr;
        }

    } catch(Exception $e) {
        if ($return_db_error) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data);
?>