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

$sql_select_tb_showroom_from_name = <<<EOD
SELECT
    *
FROM
    TB_SHOWROOM
WHERE
    NAME = :NAME
EOD;

// 전시장 생성.
$sql_insert_tb_showroom = <<<EOD
INSERT INTO TB_SHOWROOM
(
    NAME,
    DESCRIPTION,
    LINK,
    IMG_URL,
    BGM_URL,
    CONTENT_KO,
    CONTENT_EN,
    DATA
)
VALUES
(
    :NAME,
    :DESCRIPTION,
    :LINK,
    :IMG_URL,
    :BGM_URL,
    :CONTENT_KO,
    :CONTENT_EN,
    :DATA
)
EOD;

// 전시장 업데이트
$sql_update_tb_showroom = <<<EOD
UPDATE
    TB_SHOWROOM
SET
    NAME = :NAME,
    DESCRIPTION = :DESCRIPTION,
    LINK = :LINK,
    IMG_URL = :IMG_URL,
    BGM_URL = :BGM_URL,
    CONTENT_KO = :CONTENT_KO,
    CONTENT_EN = :CONTENT_EN,
    DATA = :DATA,
    U_DATE = CURRENT_TIMESTAMP
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

// 모델 파일 목록 조회.
$sql_select_tb_model_file = <<<EOD
SELECT
    *
FROM
    TB_MODEL_FILE
ORDER BY C_DATE DESC
EOD;

// 모델 파일 정보 조회.
$sql_select_tb_model_file_from_id = <<<EOD
SELECT
    *
FROM
    TB_MODEL_FILE
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 모델 파일 정보 조회.
$sql_select_tb_model_file_from_url = <<<EOD
SELECT
    *
FROM
    TB_MODEL_FILE
WHERE
    URL = :URL
EOD;

// 모델 파일 정보 생성.
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
    DESCRIPTION,
    DATA
) VALUES (
    :EXT,
    :NAME,
    :FULL_NAME,
    :DIR_PATH,
    :DIR_URL,
    :PATH,
    :URL,
    :SIZE,
    :DESCRIPTION,
    :DATA
)
EOD;

// 모델 파일 정보 업데이트.
$sql_update_tb_model_file = <<<EOD
UPDATE
    TB_MODEL_FILE
SET
    EXT = :EXT,
    NAME = :NAME,
    FULL_NAME = :FULL_NAME,
    DIR_PATH = :DIR_PATH,
    DIR_URL = :DIR_URL,
    PATH = :PATH,
    URL = :URL,
    SIZE = :SIZE,
    DESCRIPTION = :DESCRIPTION,
    DATA = :DATA,
    U_DATE = CURRENT_TIMESTAMP
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 모델 파일 정보 삭제.
$sql_delete_tb_model_file = <<<EOD
DELETE FROM
    TB_MODEL_FILE
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 페이지 변수 조회.
$sql_select_tb_page_variable_from_name = <<<EOD
SELECT
    VALUE
FROM
    TB_PAGE_VARIABLE
WHERE
    NAME = :NAME
EOD;

// 페이지 변수 업데이트.
$sql_update_tb_page_variable = <<<EOD
UPDATE
    TB_PAGE_VARIABLE
SET
    VALUE = :VALUE,
    U_DATE = CURRENT_TIMESTAMP
WHERE
    NAME = :NAME
EOD;

// 기본 전시장 데이터 조회.
$sql_select_main_showroom = <<< EOD
SELECT
    B.*
FROM
    TB_PAGE_VARIABLE A
    JOIN TB_SHOWROOM B ON B.SEQ_ID = A.VALUE
WHERE
    A.NAME = "MAIN_SHOWROOM"
EOD;

// 상품 파일 정보 생성.
$sql_insert_tb_product_file = <<<EOD
INSERT INTO TB_PRODUCT_FILE
(
    EXT,
    NAME,
    FULL_NAME,
    DIR_PATH,
    PATH,
    SIZE,
    DESCRIPTION
) VALUES (
    :EXT,
    :NAME,
    :FULL_NAME,
    :DIR_PATH,
    :PATH,
    :SIZE,
    :DESCRIPTION
)
EOD;

// 상품 파일 목록 조회.
$sql_select_tb_product_file = <<<EOD
SELECT
    *
FROM
    TB_PRODUCT_FILE
ORDER BY C_DATE DESC
EOD;

// 상품 파일 정보 삭제.
$sql_delete_tb_product_file = <<<EOD
DELETE FROM
    TB_PRODUCT_FILE
WHERE
    SEQ_ID = :SEQ_ID
EOD;

// 상품 파일 정보 생성.
$sql_insert_tb_product_key = <<<EOD
INSERT INTO TB_PRODUCT_KEY
(
    PRODUCT_ID,
    DOWNLOAD_KEY,
    DESCRIPTION,
    END_DATE
) VALUES (
    :PRODUCT_ID,
    :DOWNLOAD_KEY,
    :DESCRIPTION,
    :END_DATE
)
EOD;

// 상품 ID로 다운로드 key 정보 조회.
$sql_select_tb_product_key_from_product_id = <<<EOD
SELECT
    A.*,
    COALESCE(B.NAME, "-delete-") AS PRODUCT_NAME
FROM
    TB_PRODUCT_KEY A
    LEFT OUTER JOIN TB_PRODUCT_FILE B ON B.SEQ_ID = A.PRODUCT_ID
WHERE
    A.PRODUCT_ID = :PRODUCT_ID
ORDER BY A.C_DATE DESC
EOD;

// 다운로드용 key 정보 조회.
$sql_select_download_data = <<<EOD
SELECT
    A.*,
    B.FULL_NAME AS PRODUCT_FILE_NAME,
    B.PATH AS PRODUCT_PATH
FROM
    TB_PRODUCT_KEY A
    JOIN TB_PRODUCT_FILE B ON B.SEQ_ID = A.PRODUCT_ID
WHERE
    BINARY A.DOWNLOAD_KEY = :DOWNLOAD_KEY
    AND A.END_DATE >= DATE(NOW())
EOD;

// 상품 다운로드 key 목록 조회.
$sql_select_tb_product_key = <<<EOD
SELECT
    A.*,
    COALESCE(B.NAME, "-delete-") AS PRODUCT_NAME
FROM
    TB_PRODUCT_KEY A
    LEFT OUTER JOIN TB_PRODUCT_FILE B ON B.SEQ_ID = A.PRODUCT_ID
ORDER BY A.C_DATE DESC
EOD;

// 상품 다운로드 key 삭제.
$sql_delete_tb_product_key = <<<EOD
DELETE FROM
    TB_PRODUCT_KEY
WHERE
    SEQ_ID = :SEQ_ID
EOD;
?>