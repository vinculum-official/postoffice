<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '#lib/auth-client';
	let { data, form } = $props();

	let content = $state('');

	let settingsOpen = $state(false);
	let logoutError = $state('');

	async function logout() {
		logoutError = '';

		try {
			const { error } = await authClient.signOut();

			if (error) throw new Error(error.message);

			await goto('/');
		} catch (err) {
			logoutError = err instanceof Error ? err.message : 'Logout failed.';
		}
	}
</script>

<svelte:head>
	<title>mailroom - postoffice</title>
	<meta name="description" content="Your Postoffice mailroom." />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=settings"
	/>
</svelte:head>

<div class="min-h-screen bg-white text-black md:grid md:grid-cols-[240px_1fr]">
	<!-- Sidebar -->
	<aside
		class="flex flex-col border-b border-neutral-200 bg-black p-6 text-white md:sticky md:top-0 md:h-screen md:border-r md:border-b-0 md:border-neutral-800"
	>
		<a href="/home" class="text-2xl font-semibold tracking-tight">
			postoffice<span class="text-neutral-500">.</span>
		</a>

		<nav class="mt-14 flex flex-col gap-7 text-sm">
			<a href="/home" class="font-semibold text-white">Home</a>
			<a href="/messages" class="text-neutral-400 hover:text-white">Messages</a>
			<a href="/archive" class="text-neutral-400 hover:text-white">Archive</a>
			<a href="/profile/{data.currentUser.username}" class="text-neutral-400 hover:text-white"
				>Profile</a
			>
		</nav>

		<div class="mt-auto flex items-center justify-between pt-8 text-xs text-neutral-500">
			<span>your desk.</span>

			<button
				type="button"
				onclick={() => (settingsOpen = true)}
				aria-label="Settings"
				class="flex items-center justify-center rounded-md p-2 transition hover:bg-neutral-800 hover:text-white"
			>
				<span class="material-symbols-outlined">settings</span>
			</button>
		</div>
	</aside>

	<!-- Main feed -->
	<main class="mx-auto w-full max-w-2xl">
		<header
			class="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-6 py-5 backdrop-blur"
		>
			<h1 class="text-xl font-semibold">The mailroom.</h1>
			<p class="mt-1 text-xs text-neutral-500">Notes from around your world.</p>
		</header>

		<!-- Composer -->
		<section class="border-b border-neutral-200 px-6 py-6">
			<div class="mb-4">
				<p class="text-sm font-medium">{data.currentUser.name}</p>
				<p class="text-xs text-neutral-400">@{data.currentUser.username}</p>
			</div>

			<form method="POST" action="?/create" class="space-y-4">
				<textarea
					name="content"
					bind:value={content}
					maxlength="500"
					required
					placeholder="What's on your mind?"
					class="min-h-28 w-full resize-none rounded-2xl border-2 border-neutral-200 bg-transparent text-base leading-relaxed outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-black focus:ring-0 focus:outline-none"
				></textarea>

				{#if form?.error}
					<p class="text-sm text-red-600">{form.error}</p>
				{/if}

				<div class="flex items-center justify-between">
					<span
						class:text-red-600={Array.from(content).length > 500}
						class="text-xs text-neutral-400"
					>
						{Array.from(content).length} / 500
					</span>

					<button
						type="submit"
						disabled={!content.trim() || Array.from(content).length > 500}
						class="rounded-2xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Send note
					</button>
				</div>
			</form>
		</section>

		<!-- Notes -->
		{#if data.notes.length === 0}
			<div class="px-6 py-20 text-center">
				<h2 class="text-lg font-medium">The mailroom is quiet.</h2>
				<p class="mt-2 text-sm text-neutral-400">Send the first note.</p>
			</div>
		{:else}
			{#each data.notes as note (note.id)}
				<article class="border-b border-neutral-200 px-6 py-6">
					<div class="flex items-center justify-between gap-3">
						<div class="min-w-0">
							<span class="text-sm font-semibold">{note.authorName}</span>
							<span class="ml-1 text-xs text-neutral-400">@{note.username}</span>
						</div>

						<time class="shrink-0 text-xs text-neutral-400">
							{new Date(note.createdAt).toLocaleString()}
						</time>
					</div>

					<p class="mt-4 text-sm leading-7 break-words whitespace-pre-wrap">{note.content}</p>

					<div class="mt-5 flex gap-6 text-xs text-neutral-400">
						<span>Reply</span>
						<span>Appreciate</span>
						<span>Forward</span>
					</div>
				</article>
			{/each}
		{/if}

		<footer class="px-6 py-8 text-center text-xs text-neutral-400">
			That's everything for now.
		</footer>
	</main>
	{#if settingsOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="presentation"
			onclick={() => (settingsOpen = false)}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="settings-title"
				class="w-full max-w-sm bg-white p-6 text-black shadow-xl"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="flex items-center justify-between">
					<h2 id="settings-title" class="text-lg font-semibold">Settings</h2>

					<button
						type="button"
						onclick={() => (settingsOpen = false)}
						class="text-xl text-neutral-400 hover:text-black"
						aria-label="Close settings"
					>
						&times;
					</button>
				</div>

				<div class="mt-8">
					<button
						type="button"
						onclick={logout}
						class="w-full border border-neutral-200 px-4 py-3 text-left text-sm transition hover:border-red-500 hover:text-red-600"
					>
						Log out →
					</button>

					{#if logoutError}
						<p class="mt-3 text-sm text-red-600">{logoutError}</p>
					{/if}
				</div>

				<p class="mt-8 text-xs text-neutral-400">postoffice. settings</p>
			</section>
		</div>
	{/if}
</div>
