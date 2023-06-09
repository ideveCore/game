<script lang="ts">
	export let isLoading = false;
</script>

{#if isLoading}
	<div
		class="loading-animation bg-slate-800 dark:bg-gray-100 after:bg-gray-100 after:dark:bg-slate-800"
	/>
{/if}

<style>
	.loading-animation {
		width: 1.7em;
		height: 1.7em;
		border-radius: 50%;
		position: relative;
		animation: rotate 1000ms linear forwards infinite;
	}
	.loading-animation::after {
		content: '';
		width: 0.7em;
		height: 0.7em;
		position: absolute;
		top: 0.3em;
		left: 0.3em;
		border-radius: 50%;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>