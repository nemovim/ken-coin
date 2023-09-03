<script>
	export let data;

	let transactionArr = [];

	$: {
		if (data?.transactions) {
			transactionArr = JSON.parse(data.transactions);
		}
	}
</script>

<article>
	{#if data?.transactions}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Date</th>
					<th>Giver</th>
					<th>Taker</th>
					<th>Volume</th>
					<th>Memo</th>
				</tr>
			</thead>
			<tbody>
				{#each transactionArr as transaction}
					<tr>
						<td>{transaction._id}</td>
						<td>{transaction.createdAt}</td>
						<td>{transaction.giver}</td>
						<td>{transaction.taker}</td>
						<td>{transaction.volume}</td>
						{#if transaction.memo !== ''}
							<td>{transaction.memo}</td>
						{:else}
							<td>N/A</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</article>

<style lang="scss">
	td, th {
		font-size: .8rem;
		padding: .5rem 1rem;
		text-align: center;
	}
</style>