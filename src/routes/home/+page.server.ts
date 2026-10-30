import { redirect, fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

import { auth } from '#lib/server/auth';
import { db } from '#lib/server/db';
import { notes } from '#lib/server/db/social-schema';
import { user } from '#lib/server/db/auth-schema';

export async function load({ request }) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    redirect(303, '/');
  }

  const feed = await db
    .select({
      id: notes.id,
      content: notes.content,
      createdAt: notes.createdAt,
      authorId: user.id,
      authorName: user.name,
      username: user.username
    })
    .from(notes)
    .innerJoin(user, eq(notes.authorId, user.id))
    .orderBy(desc(notes.createdAt))
    .limit(50);

  return {
    currentUser: session.user,
    notes: feed
  };
}

export const actions = {
  create: async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      redirect(303, '/');
    }

    const data = await request.formData();
    const content = String(data.get('content') ?? '').trim();

    const length = Array.from(content).length;

    if (!content) {
      return fail(400, { error: 'A note cannot be empty.' });
    }

    if (length > 500) {
      return fail(400, { error: 'Notes cannot exceed 500 characters.' });
    }

    await db.insert(notes).values({
      authorId: session.user.id,
      content
    });

    return { success: true };
  }
};