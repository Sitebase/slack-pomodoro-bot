module.exports = function(command, data) {
    return {
        attachments: [
            {
                fallback: 'Please sign in at https://pomodoro.ambassify.com/oauth/authorize?scope=dnd:write',
                color: '#3AA3E3',
                pretext: 'You\'re not connected to Pomodoro yet, please use the link below to connect your account.',
                title: 'Sign in to Pomodoro',
                title_link: 'https://pomodoro.ambassify.com/oauth/authorize?scope=dnd:write',
                text: "Pomodoro by Ambassify provides an awesome way to maximize your productivity. Sign in here to connect your account.",
            }
        ]
    };
}
