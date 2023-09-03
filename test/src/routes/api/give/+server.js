import coin from '$lib/server/coin.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    console.log(await request.json());
	let { userNumber, volume, memo = '', type } = await request.json();

	if (type === 'user') {
		return json(coin.giveCoinToUser(userNumber, volume, memo));
	} else if (type === 'house') {
		return json(coin.giveCoinToHouse(userNumber, volume, memo));
	} else {
		return false;
	}
}
