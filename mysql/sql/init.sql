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
        `password`
    )
VALUES
    -- 主キーとは、テーブルの中で一意に決まる値のこと
    (1, 'taka', 'abcd1234@gmail.com', 'abcd1234'),
    -- 文字コードはutf8
    (2, 'yasuo', 'xyz5678@gmail.com', 'xyz5678') -- 文字コードはutf8
;