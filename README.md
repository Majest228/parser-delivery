# Руководство по запуску Puppeteer бота на Node.js

## Предварительные требования

- Установленный Node.js на вашем компьютере. Вы можете скачать его [здесь](https://nodejs.org/).

## Установка

1. Клонируйте репозиторий на ваш компьютер:

`git clone https://github.com/Majest228/parser-delivery.git`

2. Перейдите в каталог проекта:

`cd ваш-репозиторий`

3. Установите необходимые зависимости с помощью npm:

`npm install`

- Использование

1. Откройте терминал и запустите бота с помощью следующей команды:

`node index.js`

- Это запустит браузер Puppeteer, перейдет на указанный URL, соберет необходимую информацию и сохранит ее в файл delivery.json.

# Замечания

- Убедитесь, что у вас стабильное интернет-соединение во время работы бота, так как он основан на веб-скрапинге.

- Настройте параметр headless в конфигурации puppeteer.launch в файле bot.js в соответствии с вашими предпочтениями. Если установлено значение true, браузер будет работать в режиме headless (без видимого пользовательского интерфейса); если установлено значение false, пользовательский интерфейс браузера будет видимым.
