-- 1.ここがDBバーで使う、SQL文のファイル
CREATE TABLE `users` (
    -- テーブル名は複数形
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    -- bigintは20桁までの整数
    `name` varchar(30) NOT NULL DEFAULT '',
    -- varcharは文字列
    `email` varchar(50) NOT NULL DEFAULT '',
    -- varcharは文字列
    `password` varchar(100) NOT NULL DEFAULT '',
    -- NOT NULLは空白(空文字)はだめということ
    `address` varchar(100) NOT NULL DEFAULT '',
    -- NOT NULLは空白(空文字)はだめということ
    `username` varchar(100) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`) -- 主キー
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- 文字コードはutf8
--  NOT NULLは空白(空文字)はだめということ
-- ここがAPIテスターで使う、POSTの部分になる（今回使う部分としては、"name","email,"password"になる）
-- ユニーク制約の追加
ALTER TABLE
    `users`
ADD
    CONSTRAINT `uk_users_email` UNIQUE (`email`);

INSERT INTO
    `users` (
        `id`,
        `name`,
        `email`,
        `password`,
        `address`,
        `username`
    )
VALUES
    -- passwordは「password」をハッシュ化したもの
    -- 主キーとは、テーブルの中で一意に決まる値のこと
    (
        1,
        'taka',
        'abcd1234@gmail.com',
        '$2b$10$2oqEt9Ry6ONCryNDJY6hMeRSXGM2RVELeGXlmaxwBGPACo80hTbAe',
        '東京都新宿区新宿1-1-1',
        'username_1'
    ),
    -- 文字コードはutf8
    (
        2,
        'yasuo',
        'xyz5678@gmail.com',
        '$2b$10$2oqEt9Ry6ONCryNDJY6hMeRSXGM2RVELeGXlmaxwBGPACo80hTbAe',
        '神奈川県横浜市横浜1-1-1',
        'username_2'
    ) -- 文字コードはutf8
;

CREATE TABLE `icons` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `image_url` varchar(255) NOT NULL DEFAULT '',
    `user_id` bigint unsigned NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

ALTER TABLE
    `icons`
ADD
    CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

INSERT INTO
    `icons` (
        `id`,
        `image_url`,
        `user_id`
    )
VALUES
    (
        1,
        'https://invoice-front-images.s3.ap-northeast-1.amazonaws.com/87DD9D2F-0762-4539-BDF2-49A698AE7C67_1_102_a.jpeg',
        1
    ),
    (
        2,
        'https://invoice-front-images.s3.ap-northeast-1.amazonaws.com/cooking_sauce.png',
        2
    );