import coin from '$lib/server/coin.js';

export async function load({ locals }) {
    console.log(locals)
    const name = locals.session.name.split('/').shift();
    const email = locals.session.email;


    let account  = await coin.getAccountByAid(email);

    console.log(account);

    if (!account) {
        await coin.createAccount(email, name, 0);
        account  = await coin.getAccountByAid(email);
    }

    return {
        account: JSON.stringify(account),
    };
}