import coin from '$lib/server/coin.js';
import { error } from '@sveltejs/kit';
import { PUBLIC_COIN_ADMIN_AID } from '$env/static/public';

export async function load({ locals }) {

	const email = locals.session.email;

	if (email !== PUBLIC_COIN_ADMIN_AID ) {
		throw error(403, 'Unauthorized');
	}

}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const giver = data.get('giver');
		const taker = data.get('taker');
		const volume = data.get('volume');
		const memo = data.get('memo');

		try {
		let result = await coin.transactCoin({
			giver,
			taker,
			volume,
			memo
		});

		return {
			success: true,
			action: 'transact',
			data: JSON.stringify(result)
		};

		} catch(e) {
			return {
				success: false,
				action: 'transact',
				data: e.message,
			};
		}
	},
	// signup: async ({ request }) => {
	// 	const DATA = await request.formData();
	// 	return {
	// 		success: true,
	// 		action: 'signup',
	// 		data: JSON.stringify(
	// 			await coin.createUser({
	// 				email: DATA.get('email'),
	// 				name: DATA.get('name'),
	// 				number: DATA.get('number'),
	// 				house: DATA.get('house')
	// 			})
	// 		)
	// 	};
	// },
};
