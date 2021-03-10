# Лебовски\*

> _*Название вымышлено и любые совпадения случайны 🙂_

Бот для ведения статистики в хелпдеск-каналах в Slack

## Фичи
- Отслеживание сообщений в Google Sheets
- Базовый ворклог-менеджер
- Подсчет AFRT и ACRT
- Может быть запущен в Heroku

## Установка
1. Установите на сервер Node.js (желательно последнюю LTS-версию) и Yarn
2. `git clone https://github.com/skyeng/lebowski.git`
3. `cd lebowski && yarn install`
4. Создайте копию [этого](https://docs.google.com/spreadsheets/d/15NmxG28Bqi5dXiegEnXSUD7O0dWk4jHnW6oSRZ7wECg/edit?usp=sharing) Google Sheet в своем Google Drive
5. В `config/projects.js` замените айди таблицы на айди вашей таблицы (есть в ссылке на таблицу) и айди канала на тот, в котором вы хотите собирать обращения ([как узнать айди канала](https://stackoverflow.com/questions/40940327/what-is-the-simplest-way-to-find-a-slack-team-id-and-a-channel-id))
6. Сгенерируйте API-ключ для Google Sheets
7. Сгенерируйте API-ключ для Slack
8. Создайте файл `config/secrets.js` с таким содержанием
    ```js
    module.exports = {
      slack: {
        signingSecret: 'вставьте сюда signing secret',
        token: 'вставьте сюда api токен',
      },
      google: {}, // Замените {} на содержимое json-фала полученного от Google
    };
    ```
9. Запустите бота с помощью `yarn start`
10. В API-консоли Slack в настройках вашего бота во вкладке Event Subscriptions выполните эти действия
    - Включите Events
    - В Subscribe to bot events добавьте ивенты
        - `message.channels`
        - `reaction_added`
    - В Request URL напишите `http://{адрес вашего сервера}:5000/slack/events`
11. В API-консоли Slack в настройках вашего бота во вкладке Interactivity & Shortcuts включите Interactivity и в Request URL напишите `http://{адрес вашего сервера}:5000/slack/action`
12. Сохраните
13. Добавьте бота в канал
14. Вы великолепны! Теперь бот должен отвечать на сообщения в треде

## Создание API-ключа для Google Sheets
1. Идите в [Google Developer Console](https://console.developers.google.com/project)
2. Выберите или создайте проект
3. Включите для проекта Drive API и Google Sheets API
    - В боковом меню выберите APIs&Auth > APIs
    - Найдите там Drive API и нажмите на него
    - Нажмите на Enable API
    - Повторите эти три шага для Google Sheets API
4. Сгенерите JSON ключ
    - В боковом меню выберите APIs & auth > Credentials
    - Нажмите на Add credentials
    - Выберите Service account
    - Если спросят тип, выберите JSON
    - Нажмите на Create
    - Откройте скачанный файл в редакторе, найдите там емейл аккаунта и дай этому емейлу write-доступ в гугл-таблице, которую вы создали ранее в шаге 4 инструкции по установке


## Создание API-ключа для Slack
1. Зайдите в [Slack API Console](https://api.slack.com/apps)
2. Нажмите Create new app
3. Назовите ее Лебовски или как-нибудь еще
4. В Development Slack Workspace выберите воркспейс где будете устанавливать бота
5. В OAuth & Permissions -> Scopes -> Bot Token Scopes добавьте ему эти Scopes
    - `channels:history`
    - `chat:write`
    - `chat:write.customize`
    - `chat:write.public`
    - `reactions:read`
    - `usergroups:read`
    - `users.profile:read`
    - `users:read`
6. В OAuth & Permissions нажмите `Install to Workspace`
7. После установки у вас рядом с этой кнопкой появится ваш API-токен, а в Basic Information вы можете найти Signing Secret
8. Вернитесь к пункту 5 инструкции по установке