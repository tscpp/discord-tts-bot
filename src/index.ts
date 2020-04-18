import { Client } from 'discord.js';
import { say } from './say';
import * as fs from 'fs';

const client = new Client();

client.on('ready', () => console.log('Logged in as: ' + client.user.tag));

client.on('message', (message) => {
	if (message.content === 'tts stop') {
		say.stop();
		return;
	}

	if (message.content.startsWith('tts')) {
		let text: string = null;

		{
			const m = message.content.match(/tts (.+)/);

			if (m && m[1])
				text = m[1];
		}

		if (text === null) {
			message.channel.send('tts [message]');
			return;
		} else {
			if (!message.member.voice.channel) {
				message.channel.send('You need to be in a voice channel.');
				return;
			}

			say(message.member.voice.channel, text);
		}
	}
});

say.clear();

client.login(fs.readFileSync('token').toString());
