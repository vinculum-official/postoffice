<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '#lib/auth-client';

	let mode = $state<'signup' | 'login'>('signup');

	let name = $state('');
	let username = $state('');
	let email = $state('');
	let password = $state('');

	let loading = $state(false);
	let error = $state('');

	async function submit() {
		loading = true;
		error = '';

		try {
			if (mode === 'signup') {
				const { error: authError } = await authClient.signUp.email({
					name,
					username,
					email,
					password
				});

				if (authError) throw new Error(authError.message);
			} else {
				const result = email.includes('@')
					? await authClient.signIn.email({ email, password })
					: await authClient.signIn.username({
							username: email,
							password
						});

				if (result.error) throw new Error(result.error.message);
			}

			await goto('/home');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{mode} - postoffice</title>
	<meta name="description" content="The social media that doesn't demand your attention." />
</svelte:head>

<main class="grid min-h-screen md:grid-cols-2">
	<!-- Left side -->
	<section
		class="flex min-h-[280px] items-center justify-center bg-black px-8 py-16 text-white md:min-h-screen"
	>
		<div class="max-w-md">
			<h1 class="text-5xl font-semibold tracking-tight md:text-6xl">
				postoffice<span class="text-neutral-500">.</span>
			</h1>

			<p class="mt-5 text-base leading-relaxed text-neutral-400 md:text-lg">
				the social media that doesn't demand your attention.
			</p>
		</div>
	</section>

	<!-- Right side -->
	<section class="flex min-h-screen items-center justify-center bg-white px-8 py-16 text-black">
		<div class="w-full max-w-sm">
			<div class="mb-10">
				<p class="mb-3 text-sm text-neutral-400">
					{mode === 'signup' ? 'New here?' : 'Welcome back.'}
				</p>

				<h2 class="text-3xl font-semibold tracking-tight">
					{mode === 'signup' ? 'Create an account' : 'Sign in'}
				</h2>

				<p class="mt-2 text-sm text-neutral-500">
					{mode === 'signup' ? 'A place to post, read, and be.' : 'Pick up where you left off.'}
				</p>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
				class="space-y-5"
			>
				{#if mode === 'signup'}
					<div>
						<label for="name" class="mb-2 block text-sm">Name</label>
						<input
							id="name"
							bind:value={name}
							required
							autocomplete="name"
							placeholder="Your name"
							class="w-full border border-neutral-300 px-3 py-3 text-sm transition outline-none focus:border-black"
						/>
					</div>

					<div>
						<label for="username" class="mb-2 block text-sm">Username</label>
						<input
							id="username"
							bind:value={username}
							required
							minlength="3"
							maxlength="24"
							autocomplete="username"
							placeholder="your username"
							class="w-full border border-neutral-300 px-3 py-3 text-sm transition outline-none focus:border-black"
						/>
					</div>
				{/if}

				<div>
					<label for="email" class="mb-2 block text-sm">
						{mode === 'signup' ? 'Email address' : 'Email or username'}
					</label>
					<input
						id="email"
						bind:value={email}
						required
						autocomplete={mode === 'signup' ? 'email' : 'username'}
						type={mode === 'signup' ? 'email' : 'text'}
						placeholder={mode === 'signup' ? 'you@example.com' : 'you@example.com or username'}
						class="w-full border border-neutral-300 px-3 py-3 text-sm transition outline-none focus:border-black"
					/>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm">Password</label>
					<input
						id="password"
						bind:value={password}
						required
						minlength="8"
						autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
						type="password"
						placeholder="At least 8 characters"
						class="w-full border border-neutral-300 px-3 py-3 text-sm transition outline-none focus:border-black"
					/>
				</div>

				{#if error}
					<p class="text-sm text-red-600">{error}</p>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="w-full cursor-pointer bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
				>
					{loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
				</button>
			</form>

			<div class="mt-8 text-sm text-neutral-500">
				{#if mode === 'signup'}
					Already have an account?
					<button
						type="button"
						class="ml-1 cursor-pointer text-black underline underline-offset-4"
						onclick={() => {
							mode = 'login';
							error = '';
						}}
					>
						Sign in
					</button>
				{:else}
					Don't have an account?
					<button
						type="button"
						class="ml-1 cursor-pointer text-black underline underline-offset-4"
						onclick={() => {
							mode = 'signup';
							error = '';
						}}
					>
						Sign up
					</button>
				{/if}
			</div>

			<p class="mt-16 text-xs text-neutral-400">postoffice. &copy; 2026</p>
		</div>
	</section>
</main>
