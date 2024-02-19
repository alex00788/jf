import moment from "moment";

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


export interface Day {
value: moment.Moment,
  active: boolean,
  disabled: boolean,
  selected: boolean,
}

export interface Week {
days: Day[]
}
