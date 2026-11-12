import vine from '@vinejs/vine'

export const sendMessageValidator = vine.create({
  content: vine.string().trim().minLength(1).maxLength(2000),
})