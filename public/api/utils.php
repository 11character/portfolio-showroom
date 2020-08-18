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
?>