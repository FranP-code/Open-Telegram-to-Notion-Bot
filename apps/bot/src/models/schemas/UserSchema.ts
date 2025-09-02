import { Schema, model, Model } from 'mongoose'

type NotionAuthKey = {
  iv: string,
  content: string
}

export interface IUser {
  userId: number,
  notionAuthKey: NotionAuthKey,
  defaultDatabaseName: string,
  defaultDatabaseId?: string
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: 'number',
    required: true
  },
  notionAuthKey: {
    type: Object,
    required: true
  },
  defaultDatabaseName: {
    type: 'string'
  },
  defaultDatabaseId: {
    type: 'string'
  }
})

export const UserModel: Model<IUser> = model('Users', UserSchema)
