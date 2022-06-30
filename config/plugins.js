module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "sendmail",
      settings: {
        defaultFrom: "charleselie.piquemal@gmail.com",
        defaultReplyTo: "charleselie.piquemal@gmail.com",
      },
    },
  },
});
