const _ = require('lodash');
const store = require('lib/dynamo');
const db = store('pomodoros', {
    primaryKey: 'user'
});

const message = _.template(
`Hello <%= me.user_name %>!<%
if (me.busy) {
    %>You're working on your pomodoro :+1:<%
} else {
    %>You're not in Pomodoro mode :disappointed:<%
} %>

<% if (colleagues.length) {
    %>Some of your teammates are currently in Pomodoro mode:
<% for(var i in colleagues) {
        var colleague = colleagues[i];
        %><@<%= colleague.id %>|<%= colleague.user_name %>><%
    }
} %>`
)

const START_BUTTON = {
    fallback: "Start a pomodoro by typing /pomo start",
    callback_id: "pomo_actions",
    attachment_type: "default",
    actions: [
        {
            name: "start_pomodoro",
            text: "Start Pomodoro",
            type: "button",
            value: "start_pomodoro",
            style: "primary"
        }
    ]
};

const STOP_BUTTON = {
    fallback: "Stop a pomodoro by typing /pomo stop",
    callback_id: "pomo_actions",
    attachment_type: "default",
    actions: [
        {
            name: "stop_pomodoro",
            text: "Stop Pomodoro",
            type: "button",
            value: "stop_pomodoro",
            style: "danger"
        }
    ]
};

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return db.list(team).then(all => {
        const meKey = `${team}.${user}`;

        const me = _.find(all, v => v.user == meKey);
        const busy = me.busy;

        const colleagues = _(all)
            .filter(v => v.busy && v.user != meKey)
            .map(v => ({
                id: v.user.split('.').pop(),
                user_name: v.user_name,
                busy: v.busy
            })).value();

        return {
            text: message({ me, colleagues }),
            attachments: [
                busy ? STOP_BUTTON : START_BUTTON
            ]
        }
    });
}
