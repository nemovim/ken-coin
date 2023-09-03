<script>
	let account= null;

	let houseArr = null;

	export let data;

	$: {
		if (data?.account) {
			account = JSON.parse(data.account);
		}
	}

	function signout() {
		location.href = 'http://localhost:5173/?re=out';
	}
</script>

<article>
	<div>
		<p>Account ID: {account.aid}</p>
		<p>Name: {account.name}</p>
		<p>House: {account.groupArr}</p>
		<p>Amount: {account.amount}</p>
		<button on:click={signout}>signout</button>
	</div>

</article>

<article>
	{#if data?.house}
		{#each houseArr as house}
			<div>
				<h2>{house.name} House</h2>
				<p>Amount: {house.amount}</p>
			</div>
		{/each}
	{/if}
</article>
