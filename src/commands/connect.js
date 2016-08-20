module.exports = function(command, data) {
    return {
        text: 'You\'re not connected to Pomodoro bot yet.',
        attachments: [
            {
                text: 'Please sign in',
                fallback: 'https://pomodoro.ambassify.com/oauth/authorize',
                callback_id: 'connect',
                color: '#3AA3E3',
                attachment_type: 'default',
                actions: [
                    {
                        name: 'connect',
                        text: 'Sign in',
                        type: 'button',
                        value: 'connect',
                        style: 'primary'
                    }
                ]
            }
        ]
    };
}
