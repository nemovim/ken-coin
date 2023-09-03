import coin from '$lib/server/coin.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	return json(coin.getHouseAccounts());
}
