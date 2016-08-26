# pjacli

## Installation

1. easy code with cmd
`npm install -g http://10.17.1.139/zw/pjacli/repository/archive.tar.gz?ref=master`

2. config your env Variables
![](./resource/2016-08-26_162337.png)

## Features

1. list doudou game
    `pjacli doudouls` 列出豆豆游戏
    帮助见`pjacli doudouls -h`
    ![](./resource/2016-08-26_160539.png)
2. build doudou game with doudouls output
    `pjacli doudouls -k 63 | pjacli doudoubuild ` 搜索游戏目录下63开头的游戏并构建他们
    帮助见`pjacli doudoubuild -h`
    ![](./resource/2016-08-26_160757.png)

