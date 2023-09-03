<script>
	let account = null;

	export let form;
	export let data;

	$: {
		if (data?.account) {
			account = JSON.parse(data.account);
		}
	}
</script>

<article>
	<div>
		<p>Account ID: {account.aid}</p>
		<p>Name: {account.name}</p>
		<p>House: {account.groupArr}</p>
		<p>Amount: {account.amount}</p>
	</div>

	<hr>

	<div>
		<form method="post">
			<input type="text" name="giver" placeholder="giver"/>
			<input type="text" name="taker" placeholder="taker"/>
			<input type="number" name="volume" placeholder="volume" value=1/>
			<input type="text" name="memo" placeholder="memo"/>
			<button>submit</button>
		</form>
	</div>

	<hr>

	{#if form?.success === true}
	<p>성공!</p>
	{:else if form?.success === false}
	<p>실패...</p>
	<p>{form.data}</p>
	{/if}

	<!-- <div>
		<form method="POST" action="?/signup">
			<input type="text" placeholder="email" name="email" />
			<input type="text" placeholder="name" name="name" />
			<input type="text" placeholder="group" name="group" />
			<button>sign up</button>
		</form>
	</div> -->
</article>

<style lang="scss">
	hr {
		margin: 1rem 0;
	}

	input {
		padding: .3rem .6rem;
		font-size: .8rem;
	}
</style>