<?php
$dbname = 'showroom';
$dsn = 'mysql:host=127.0.0.1;port=3306;dbname=' . $dbname . ';charset=utf8';
$db_user_name = 'root';
$db_user_pwd = '000000';

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

// 전시장 목록 조회.
$sql_select_tb_showroom = <<<EOD
SELECT
    *
FROM
    TB_SHOWROOM
ORDER BY C_DATE DESC
EOD;

// 전시장 정보 조회.
$sql_select_tb_showroom_from_id = <<<EOD
SELECT
    *
FROM
    TB_SHOWROOM
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 전시장 생성.
$sql_insert_tb_showroom = <<<EOD
INSERT INTO TB_SHOWROOM
(
    NAME,
    DESCRIPTION
)
VALUES
(
    :NAME,
    :DESCRIPTION
)
EOD;

// 전시장 업데이트
$sql_update_tb_showroom = <<<EOD
UPDATE
    TB_SHOWROOM
SET
    NAME = :NAME,
    DESCRIPTION = :DESCRIPTION,
    DATA = :DATA
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 전시장 삭제.
$sql_delete_tb_showroom = <<<EOD
DELETE FROM
    TB_SHOWROOM
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 파일 목록 조회.
$sql_select_tb_model_file = <<<EOD
SELECT
    *
FROM
    TB_MODEL_FILE
ORDER BY C_DATE DESC
EOD;

// 파일정보 생성.
$sql_insert_tb_model_file = <<<EOD
INSERT INTO TB_MODEL_FILE
(
    EXT,
    NAME,
    FULL_NAME,
    DIR_PATH,
    DIR_URL,
    PATH,
    URL,
    SIZE,
    DESCRIPTION
) VALUES (
    :EXT,
    :NAME,
    :FULL_NAME,
    :DIR_PATH,
    :DIR_URL,
    :PATH,
    :URL,
    :SIZE,
    :DESCRIPTION
)
EOD;
?>