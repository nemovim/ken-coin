<header>
	<h1>
		<a href="/">KEN COIN TEST</a>
	</h1>

    <div>
	<span> | </span>
	<a href="/transaction">Transaction</a>
	<span> | </span>
	<a href="/admin">Admin</a>
    </div>
</header>

<section id="mainSection">
	<slot />
</section>

<footer>
	<p>Developed by nemovim</p>
</footer>

<style lang="scss">
	#mainSection {
		margin: 1rem;
		height: -webkit-fill-available;
		padding: 1.5rem 2rem;
		border: solid grey 0.1rem;
		background-color: white;
	}

	@mixin xer {
		position: relative;
		padding: 0.3rem;
		right: 0rem;
		display: flex;
		width: -webkit-fill-available;
		background-color: white;
	}

	header {
		@include xer;
		top: 0rem;
		border-bottom: 0.2rem solid black;
        align-items: center;

		h1 {
			a {
				font-size: 1.6rem;
				margin-top: 0.4rem;
				margin-left: 0.6rem;
				// color: black;
			}
		}

		a:hover {
			text-decoration: none;
		}

        div {
            * {
                margin-left: 1rem
            }
        }
	}

	footer {
		@include xer;
		bottom: 0rem;
		justify-content: flex-end;
		border-top: 0.1rem solid black;

		p {
			font-size: 0.6rem;
			margin: 0.2rem;
		}
	}
</style>
