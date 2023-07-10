-- 1.ここがDBバーで使う、SQL文のファイル
-- 2.SQLエディタを開き、下記のSQL文をコピペして、「SQLスクリプトを実行する」をクリックすると、DBにテーブルが作成される
CREATE TABLE `users` (
    -- テーブル名は複数形
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    -- bigintは20桁までの整数
    `name` varchar(30) NOT NULL DEFAULT '',
    -- varcharは文字列
    `mail` varchar(50) NOT NULL DEFAULT '',
    -- varcharは文字列
    `password` varchar(50) NOT NULL DEFAULT '',
    -- NOT NULLは空白(空文字)はだめということ
    PRIMARY KEY (`id`) -- 主キー
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- 文字コードはutf8
--  NOT NULLは空白(空文字)はだめということ
-- ここがAPIテスターで使う、POSTの部分になる（今回使う部分としては、"name","mail,"password"になる）
INSERT INTO
    `users` (
        -- テーブル名は複数形
        `id`,
        -- bigintは20桁までの整数
        `name`,
        -- varcharは文字列
        `mail`,
        -- varcharは文字列
        `password` -- NOT NULLは空白(空文字)はだめということ
    )
VALUES
    -- 主キーとは、テーブルの中で一意に決まる値のこと
    (1, 'taka', 'abcd1234@gmail.com', 'abcd1234'),
    -- 文字コードはutf8
    (2, 'yasuo', 'xyz5678@gmail.com', 'xyz5678') -- 文字コードはutf8
;