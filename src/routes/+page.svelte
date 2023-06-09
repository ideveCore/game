<script lang="ts">
	import { fade } from 'svelte/transition';
	import { animal_array, current_image } from '../stores';
	import LoadImage from '$lib/LoadImage.svelte';
	import cards from '../lib/assets/cards.png';
	import { getContext } from 'svelte';
	import { onMount } from 'svelte';

	const get_game_array: any = getContext('get_game_array');
	let init_game: boolean | null = null;
	let game_array: any[] = [];
	let Current_image: any = [];
	let time: ReturnType<typeof setTimeout> | null = null;
	let game_time = {
		time: 0,
		display: ''
	};
	let in_memory: string | null = null;
	let open_card_asnwer = false;
	let end_game = false;

	const open = (index: number) => {
		if (!time && !init_game) {
			if (!game_array[index].open) {
				game_array[index].open = true;
				if (!in_memory) {
					in_memory = game_array[index].animal;
					return;
				}
				if (in_memory === game_array[index].animal) {
					setTimeout(() => {
						game_array = game_array.map((item) =>
							item.animal === game_array[index].animal
								? { ...item, open: true, matched: { ...item.matched, state: true } }
								: { ...item, open: false }
						);
						in_memory = null;
						return;
					}, 1000);
				}
				in_memory = null;
				clearTimeout(time ? time : '');
				time = setTimeout(() => {
					game_array = game_array.map((item) =>
						!item.matched.state ? { ...item, open: false } : { ...item, open: true }
					);
					game_array = game_array.map((item) => ({ ...item, open: false }));
					time = null;
				}, 1000);
			}
		}
	};

	$: animal_array.subscribe((value: any[]) => {
		game_array = value;
	});
	$: current_image.subscribe((value: any[]) => {
		console.log(value);
		Current_image = value;
	});

	const format_time = (time: number) => {
		let minutes: string | number = Math.floor(time / 60);
		let extra_seconds: string | number = time % 60;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		extra_seconds = extra_seconds < 10 ? '0' + extra_seconds : extra_seconds;
		return `${minutes}:${extra_seconds}`;
	};

	onMount(() => {
		setInterval(() => {
			if (init_game !== null && !end_game) {
				if (init_game && game_time.time === 2) {
					game_time.time = 0;
					init_game = false;
				}
				game_time.time++;
				game_time.display = format_time(game_time.time);
			}
		}, 1000);
	});

	const answer_question = async (asnwer: string) => {
		const is_correct =
			Current_image.filter((item: any) => item.name === asnwer && item.current).length > 0
				? true
				: false;

		const answer_index = Current_image.findIndex((item: any) => item.name === asnwer);

		if (is_correct) {
			open_card_asnwer = false;
			Current_image[answer_index].correct = true;
			end_game = true;
			return;
		}
		game_time.time += 10;
		Current_image[answer_index].incorrect = true;
	};

	const reset_game = () => {
		open_card_asnwer = false;
		game_time.time = 0;
		game_time.display = '';
		end_game = false;
		init_game = true;
		get_game_array();
	};
</script>

<section
	class="page w-full h-full p-3 pt-0 gap-3 flex items-center flex-col bg-gray-100 dark:bg-slate-800"
	transition:fade
>
	{#if init_game === null || open_card_asnwer || end_game}
		<div
			class="dark:bg-slate-900/75 backdrop-blur w-full h-full absolute flex flex-row justify-center items-center z-30"
			transition:fade
		>
			{#if init_game == null}
				<div
					class="w-96 h-1/2 flex flex-col justify-center items-center rounded-2xl gap-5 bg-gray-100 dark:bg-slate-800"
					in:fade={{ duration: 200, delay: 300 }}
					out:fade={{ duration: 200 }}
				>
					<p class="text-black dark:text-white">Hit the famous under the cards</p>
					<button
						class="w-1/2 h-10 text-white bg-violet-600 rounded-2xl border-none outline-none"
						on:click={() => (init_game = true)}
					>
						Start
					</button>
				</div>
			{:else if open_card_asnwer}
				<div
					class="w-96 h-1/2 flex flex-col justify-start items-center rounded-2xl bg-gray-100 dark:bg-slate-800 overflow-hidden"
					in:fade={{ duration: 200, delay: 300 }}
					out:fade={{ duration: 200 }}
				>
					<header class="w-full h-12 flex justify-end items-center p-2">
						<button
							class="w-10 h-10 rounded-full text-black dark:text-white text-2xl"
							on:click={() => (open_card_asnwer = false)}
						>
							<i class="bi bi-x" />
						</button>
					</header>
					<main class="w-full h-full flex flex-col justify-center items-center gap-2 p-2">
						<p class="text-slate-800 dark:text-gray-100">What is the image under the cards?</p>
						{#each Current_image as image, index}
							<button
								class="w-full h-12 flex justify-start items-center p-2 rounded-2xl border-dashed border-slate-800 dark:border-gray-100 border-2 text-slate-800 dark:text-gray-100"
								on:click={() => answer_question(image.name)}
								class:border-red={image.incorrect}
								class:border-green={image.correct}>{index + 1}. {image.name}</button
							>
						{/each}
					</main>
				</div>
			{:else if end_game}
				<div
					class="w-96 h-1/2 flex flex-col justify-start items-center ronded-2xl bg-gray-100 dark:bg-slate-800 overflow-hidden"
					in:fade={{ duration: 200, delay: 200 }}
					out:fade={{ duration: 200 }}
				>
					<main class="w-full h-full flex flex-col justify-center items-center gap-3 p-2">
						<p class="text-slate-800 dark:text-gray-100">Congratulations you hit the image</p>
						<p class="text-slate-800 dark:text-gray-100">Pontuation: {game_time.time}</p>
						<button
							class="w-1/2 h-10 text-white bg-violet-600 rounded-2xl border-none outline-none"
							on:click={() => reset_game()}
						>
							Play again</button
						>
					</main>
				</div>
			{/if}
		</div>
	{/if}
	<!-- ===================================================== -->
	<div
		class="gap-3 w-1/2 h-20 max-sm:w-3/4 flex flex-row justify-center items-center rounded-bl-2xl rounded-br-2xl bg-violet-600 justify-self-start z-20"
	>
		<button
			class="w-16 h-12 border-2 rounded-lg border-indigo-400 outline-none text-center bg-indigo-600 text-white shadow-md shadow-indigo-700 text-2xl tooltip bottom"
			on:click={() => (open_card_asnwer = true)}
		>
			<span class="tooltiptext tex-sm">Answer question</span>
			<i class="bi bi-question" />
		</button>
		<input
			bind:value={game_time.display}
			type="text"
			class="w-20 h-12 border-2 rounded-lg border-indigo-400 outline-none text-center bg-indigo-600 text-white shadow-md shadow-indigo-700 text-2xl font-bold"
			readonly
		/>
		<button
			class="w-16 h-12 border-2 rounded-lg border-indigo-400 outline-none text-center bg-indigo-600 text-white shadow-md shadow-indigo-700 text-2xl tooltip bottom"
			on:click={() => reset_game()}
		>
			<span class="tooltiptext tex-sm">Reset game</span>
			<i class="bi bi-arrow-clockwise" />
		</button>
	</div>
	<!-- ===================================================== -->

	<!-- =========================================================== -->
	<div
		class="container w-full h-full image-container flex flex-col m-auto relative rounded-2xl overflow-hidden"
	>
		<div class="h-1/3 flex flex-row w-full z-10">
			{#each game_array as array, index}
				{#if index <= 3}
					<div
						class="w-full h-full flex justify-center items-center cursor-pointer transition duration-1000 p-0.5"
						class:transparent={array.matched.state}
						class:backdrop-blur={!array.matched.state}
					>
						{#if !array.matched.state}
							<button
								class="w-full h-full flex justify-center items-center rounded-2xl flip-container bg-violet-600"
								on:click={() => open(index)}
								class:open={init_game || array.matched.state || array.open}
								transition:fade
							>
								<div class="w-full h-full justify-center items-center flipper pointer-events-none">
									<div
										class="w-full h-full flex justify-center items-center front pointer-events-none"
									>
										<LoadImage src={cards} />
									</div>
									<div
										class="w-full h-full flex justify-center items-center back pointer-events-none"
									>
										<LoadImage src={array.image} />
									</div>
								</div>
							</button>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		<div class="h-1/3 flex flex-row w-full z-10">
			{#each game_array as array, index}
				{#if index > 3}
					{#if index < 8}
						<div
							class="w-full h-full flex justify-center items-center cursor-pointer transition duration-1000 p-0.5"
							class:transparent={array.matched.state}
							class:backdrop-blur={!array.matched.state}
						>
							{#if !array.matched.state}
								<button
									class="w-full h-full flex justify-center items-center rounded-2xl flip-container bg-violet-600"
									on:click={() => open(index)}
									class:open={init_game || array.matched.state || array.open}
									transition:fade
								>
									<div
										class="w-full h-full justify-center items-center flipper pointer-events-none"
									>
										<div
											class="w-full h-full flex justify-center items-center front pointer-events-none"
										>
											<LoadImage src={cards} />
										</div>
										<div
											class="w-full h-full flex justify-center items-center back pointer-events-none"
										>
											<LoadImage src={array.image} />
										</div>
									</div>
								</button>
							{/if}
						</div>
					{/if}
				{/if}
			{/each}
		</div>

		<div class="h-1/3 flex flex-row w-full z-10">
			{#each game_array as array, index}
				{#if index > 7}
					<div
						class="w-full h-full flex justify-center items-center cursor-pointer transition duration-1000 p-0.5"
						class:transparent={array.matched.state}
						class:backdrop-blur={!array.matched.state}
					>
						{#if !array.matched.state}
							<button
								class="w-full h-full flex justify-center items-center rounded-2xl flip-container bg-violet-600"
								on:click={() => open(index)}
								class:open={init_game || array.matched.state || array.open}
								transition:fade
							>
								<div class="w-full h-full justify-center items-center flipper pointer-events-none">
									<div
										class="w-full h-full flex justify-center items-center front pointer-events-none"
									>
										<LoadImage src={cards} />
									</div>
									<div
										class="w-full h-full flex justify-center items-center back pointer-events-none"
									>
										<LoadImage src={array.image} />
									</div>
								</div>
							</button>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
		{#each Current_image as image}
			{#if image.current}
				<LoadImage src={image.image} full={true} />
			{/if}
		{/each}
	</div>
	<!-- =========================================================== -->
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
	@media (max-width: 540px) {
		.image-container {
			width: 400px;
			height: 400px;
		}
	}
	@media (min-width: 540px) {
		.image-container {
			width: 600px;
			height: 600px;
		}
	}
	.flip-container {
		perspective: 1000px;
	}
	.flipper {
		transform-style: preserve-3d;
		transition: transform 0.8s;
		position: relative;
	}
	.open .flipper {
		transform: rotateY(180deg);
	}
	.transparent {
		background-color: transparent !important;
	}
	.front,
	.back {
		position: absolute;
		width: 100%;
		height: 100%;

		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		transition: opacity linear 200ms;
	}
	.open .front {
		opacity: 0;
	}
	.back {
		transform: rotateY(180deg);
	}
	.border-red {
		border-color: #b91c1c;
	}
	.border-green {
		border-color: #047857;
	}
</style>
