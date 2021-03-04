/* eslint-disable camelcase */
module.exports = {
  ticketCreated: (ticketID) => [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Привет! Твоё обращение зарегистрировано и ему присвоен номер ${ticketID}`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Залогать работу",
            emoji: true,
          },
          action_id: "log_work",
          value: ticketID,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Закрыть обращение",
            emoji: true,
          },
          style: "danger",
          action_id: "close_ticket",
          value: ticketID,
        },
      ],
    },
  ],
  closeTicket: (ticketID, user, channel, types, tags) => ({
    type: "modal",
    callback_id: "close_ticket_modal",
    private_metadata: `${ticketID}|${channel}`,
    title: {
      type: "plain_text",
      text: "Закрытие обращения",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Закрыть",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Отбой",
      emoji: true,
    },
    blocks: [
      {
        type: "input",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Выберите тип обращения",
            emoji: true,
          },
          action_id: "type",
          options: types.map((option) => ({
            text: {
              type: "plain_text",
              text: option,
              emoji: true,
            },
            value: option,
          })),
        },
        label: {
          type: "plain_text",
          text: "Тип обращения",
          emoji: true,
        },
      },
      {
        type: "input",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Укажите тег для обращения",
            emoji: true,
          },
          action_id: "tag",
          options: tags.map((option) => ({
            text: {
              type: "plain_text",
              text: option,
              emoji: true,
            },
            value: option,
          })),
        },
        label: {
          type: "plain_text",
          text: "Тег",
          emoji: true,
        },
      },
      {
        type: "input",
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: "notes",
          placeholder: {
            type: "plain_text",
            text: "Краткий комментарий по сути проблемы",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Заметки",
          emoji: true,
        },
      },
    ],
  }),
  logWork: (ticketID, channel) => ({
    type: "modal",
    callback_id: "log_work_modal",
    private_metadata: `${ticketID}|${channel}`,
    title: {
      type: "plain_text",
      text: "Залогать время",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Залогать",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Отбой",
      emoji: true,
    },
    blocks: [
      {
        type: "input",
        element: {
          type: "plain_text_input",
          action_id: "amount",
          placeholder: {
            type: "plain_text",
            text: "10:01",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Количество времени",
          emoji: true,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Время можно указать в формате `HHH:MM` или `MMM...`",
          },
        ],
      },
      {
        type: "input",
        element: {
          type: "plain_text_input",
          action_id: "notes",
          placeholder: {
            type: "plain_text",
            text: "Починил начислятор и сломал списыватель",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "На что вы потратили это время",
          emoji: true,
        },
      },
    ],
  }),
};
