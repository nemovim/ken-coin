import coin from '$lib/server/coin.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	let { userNumber, volume, memo = '', type } = await request.json();

	if (type === 'user') {
		return json(coin.takeCoinFromUser(userNumber, volume, memo));
	} else if (type === 'house') {
		return json(coin.takeCoinFromHouse(userNumber, volume, memo));
	} else {
		return false;
	}
}
