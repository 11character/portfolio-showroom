<?php
    // 디렉토리 제거.
    function utils_delete_dir($path) {
        if (is_dir($path)) {
            if (substr($path, strlen($path) - 1, 1) != '/') {
                $path .= '/';
            }

            $files = glob($path . '*', $GLOB_MARK);

            foreach ($files as $file) {
                if (is_dir($file)) {
                    utils_delete_dir($file);

                } else {
                    unlink($file);
                }
            }

            rmdir($path);
        }
    }

    function random_string($length = 16) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $characters_length = strlen($characters);
        $random_string = '';

        for ($i = 0; $i < $length; $i++) {
            $random_string .= $characters[rand(0, $characters_length - 1)];
        }

        return $random_string;
    }
?>