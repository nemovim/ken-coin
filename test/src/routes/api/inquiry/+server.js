import coin from '$lib/server/coin.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	let { userNumber, accountNumber } = await request.json();

	return json(coin.getAccount(userNumber, accountNumber));

}
