<?php
    include './api-login-check.php';
    include './path.php';

    $data = [
        'code' => 0,
        'data' => []
    ];

    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        $dir_path = $MODEL_FILE_DIR_PATH . '/' . $id . '/cube_texture';

        if (is_dir($dir_path)) {
            $arr = glob($dir_path . '/*', $GLOB_MARK);
            
            foreach ($arr as $file_path) {
                $info = pathinfo($file_path);

                $data['data'][] = $MODEL_FILE_DIR . '/' . $id . '/cube_texture/' . $info['basename'];
            }
        }
    }

    echo json_encode($data);
?>