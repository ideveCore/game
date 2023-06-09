<script lang="ts">
  import { onMount } from "svelte";
	import Loader from './Loader.svelte';
	export let src: any = '';
	export let full: boolean = false;

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

{#if loaded}
  <img {src} alt="Document" class="w-32 h-32 max-sm:w-16 max-sm:h-16 rounded-xl" class:full />
{:else if failed}
  <ion-icon name="warning-outline" class="text-5xl text-white"/>
{:else if loading}
<Loader isLoading={true}/>
{/if}

<style>
  .full {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
</style>