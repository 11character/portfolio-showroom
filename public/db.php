<?php
$dbname = 'showroom';
$dsn = 'mysql:host=127.0.0.1;port=3306;dbname=' . $dbname . ';charset=utf8';
$name = 'root';
$pwd = '000000';

$return_db_error = false;

// 쿼리 (EOD 문법 사용시 변수명은 들여쓰기 하지 않는다.)
// 사용자정보 조회.
$sql_select_tb_user = <<<EOD
SELECT
    *
FROM
    TB_USER
WHERE
    USER = :USER
    AND PASSWORD = MD5(:PASSWORD)
EOD;
?>