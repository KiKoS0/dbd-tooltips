import type { UserData } from './types'

let userData: UserData | null = null

export const userDataStore = () => {
  return {
    get userData() {
      return userData
    },
    setUserData: (newUserData: UserData) => {
      userData = newUserData
    }
  }
}
