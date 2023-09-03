import coin from '$lib/server/coin.js';
import AuthClient from 'ken-auth/client';
import { redirect } from '@sveltejs/kit';

coin.init().then(() => {
	console.log('[Coin Is Ready]');
});

export async function handle({ event, resolve }) {
	let authClient = new AuthClient('http://localhost:5173', '/api/authenticate', 'coin');

	let result = await authClient.authenticate(event);

	console.log('result');
	console.log(result.session);

	if (result?.status % 100 === 3) {
		throw redirect(result.status, result.location);
	}

	event.locals.session = result.session;

	return resolve(event);
}
