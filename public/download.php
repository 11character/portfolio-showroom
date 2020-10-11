<?php
    include './db.php';

    if (isset($_GET['id'])) {
        try {
            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':DOWNLOAD_KEY' => $_GET['id']
            ];

            $stmt = $pdo->prepare($sql_select_download_data);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) == 1) {
                $name = $result[0]['PRODUCT_FILE_NAME'];
                $file = $result[0]['PRODUCT_PATH'];

                if (is_file($file)) {
                    if (preg_match('MSIE', $_SERVER['HTTP_USER_AGENT'])) {
                        header('Content-type: application/octet-stream');
                        header('Content-Length: '.filesize('$file'));
                        header('Content-Disposition: attachment; filename=' . $name);
                        header('Content-Transfer-Encoding: binary');
                        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                        header('Pragma: public');
                        header('Expires: 0');

                    } else {
                        header('Content-type: file/unknown');
                        header('Content-Length: '.filesize('$file'));
                        header('Content-Disposition: attachment; filename=' . $name);
                        header('Content-Description: PHP3 Generated Data');
                        header('Pragma: no-cache');
                        header('Expires: 0');
                    }

                    $fp = fopen($file, 'rb');
                    fpassthru($fp);
                    fclose($fp);
                }
            }
        } catch(Exception $e) {
            if ($return_db_error) {
                echo $e->getMessage();
            }
        }
    }
?>