import * as Say from 'say';
import * as fs from 'fs';
import { VoiceConnection, VoiceState, VoiceChannel } from 'discord.js';

let currentConnection: VoiceConnection;

const swearWords = [
	'motherfucker',
	'motherfucking',
	'fucking',
	'fucker',
	'clunge',
	'cock',
	'dick',
	'dickhead',
	'faggot',
	'flaps',
	'gash',
	'minge',
	'prick',
	'punani',
	'pussy',
	'snatch',
	'twat',
	'cunt',
	'fuck',
	'tit',
	'nigger',
	'nigga'
];

let swearString = '';
for (const word of swearWords) {
	swearString += word + '|';
}

swearString = swearString.replace(/\|$/, '');

const swear = new RegExp(swearString, 'g');

export function say(channel: VoiceChannel, text: string) {
	const random = './tts-' + Math.random().toString().replace('.', '') + '.wav';

	Say.export(text.toLowerCase().replace(swear, 'sensitive word'), null, null, random, async () => {
		currentConnection = await channel.join();
		resetTimeout();
		setTimeout(() => currentConnection.play(random).on('finish', () => {
			fs.unlink(random, () => null);
			timeoutEnd();
		}), 500);
	});
}

export namespace say {
	export function end() {
		clear();
		stop();
	}
	
	export async function clear() {
		for (const file of fs.readdirSync('.')) {
			if (file.startsWith('tts-')) {
				fs.unlinkSync(file);
			}
		}
	}

	export function stop() {
		if (currentConnection) currentConnection.disconnect();
	}
}

let timeout: NodeJS.Timeout | null;
function timeoutEnd() {
	timeout = setTimeout(() => {
		say.end();
		timeout = null;
	}, 60000);
}

function resetTimeout() {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
}
