<script lang="ts">
	import '../styles/styles.css';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { animal_array, current_image } from '../stores';
	import Loader from '$lib/Loader.svelte';

	const get_game_array = async () => {
		const response = await fetch('/');
		const data = (await response.json()) as { array: any; current_image: any };
		animal_array.update(() => data.array);
		current_image.update(() => data.current_image);
	};

	setContext('get_game_array', get_game_array);

	let is_loading = true;

	onMount(async () => {
		await get_game_array();
		is_loading = false;
	});
</script>

{#if is_loading}
	<div
		class="page bg-grey-100 dark:bg-slate-800 w-full flex justify-center items-center flex-col gap-3"
		transition:fade
	>
		<Loader isLoading={true} />
    <h3 class="text-3xl dark:text-gray-100">Loading...</h3>
	</div>
{:else}
	<slot />
{/if}


<style>
	div {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
