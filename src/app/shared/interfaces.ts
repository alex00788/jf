export interface User {
  email: string,
  password: string
}

export interface UserData {
  accessToken: string,
  refreshToken: string,
  user: {
    email: string,
    id: number,
    "isActivated": boolean
  }
}
