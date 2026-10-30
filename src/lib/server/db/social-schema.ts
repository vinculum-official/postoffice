import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  primaryKey,
  check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth-schema';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    content: varchar('content', { length: 500 }).notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true
    }).defaultNow().notNull()
  },
  (table) => [
    check(
      'notes_not_empty',
      sql`length(trim(${table.content})) > 0`
    )
  ]
);

export const follows = pgTable(
  'follows',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', {
      withTimezone: true
    }).defaultNow().notNull()
  },
  (table) => [
    primaryKey({
      columns: [table.followerId, table.followingId]
    }),
    check(
      'follows_no_self_follow',
      sql`${table.followerId} <> ${table.followingId}`
    )
  ]
);