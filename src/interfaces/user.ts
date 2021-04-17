interface TelegramAccount {
  username: string
  chatId: string
}

export interface IUser {
  _id?: string
  username: string
  fullname: string
  authType?: string
  authId?: string
  email: string
  phoneNumber?: string
  telegramAccount?: TelegramAccount
  whatsappNotification?: boolean
  telegramNotification?: boolean
}
