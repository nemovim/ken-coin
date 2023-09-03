import coin from '$lib/server/coin.js';

export async function load() {
	const TRANSACTION_ARR = await coin.getTransactions();

	return {
		transactions: JSON.stringify(TRANSACTION_ARR)
	};
}