/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const moment = require('moment');
const axios = require('axios');
const { data } = require('./events.json');

const timeNow = moment();

const DEFAULT_WEBHOOK_URL = '#';

data.forEach((d) => {
    for (let i = 0; i < d.time.length; i++) {
        if (!d.visible) break;

        const time = moment(d.time[i], 'HH:mm');
        const difference = timeNow.diff(time, 'minutes');

        if (difference < 2 && difference > -1) {
            // SEND HOOK
            console.log(`Time now: ${timeNow}, Time Events: ${time}, Difference: ${difference}, Event Name: ${d.eventName} `);
            let content = '';
            if (d.tagExist && !d.tagExist !== undefined) {
                content += content;
                for (let j = 0; j < d.tags.length; j++) {
                    content += ` <@&${d.tags[j]}> `;
                }
            } else {
                content = d.content;
            }

            const embedObject = {
                content,
                embeds: [
                    {
                        title: d.eventName,
                        description: d.eventDesc,
                        color: 12261914,
                        author: {
                            name: 'Chillrend\'s Reminder Script',
                            url: 'https://github.com/',
                        },
                        footer: {
                            text: 'Tempest - 2023',
                        },
                        timestamp: moment().toJSON(),
                        image: {
                            url: d.bgUrl,
                        },
                    },
                ],
            };

            const url = d.webhookUrl !== undefined ? d.webhookUrl : DEFAULT_WEBHOOK_URL;

            axios.post(url, embedObject)
                .then((r) => console.log(`Successfully sent events! ${r.data}`))
                .catch((err) => console.log(`Error ! ${err}`));

            break;
        }
    }
});
