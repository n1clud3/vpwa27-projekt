import vine from '@vinejs/vine'

export const createChannelValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(100)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .unique(async (db, value) => {
      const row = await db
        .from('channels')
        .whereRaw('lower(name) = ?', [value.toLowerCase()])
        .first()
      return !row
    }),
  isPrivate: vine.boolean().optional(),
})
