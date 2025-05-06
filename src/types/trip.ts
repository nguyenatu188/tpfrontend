export type Trip = {
  id: number
  title: string
  startDate: string
  endDate: string
  country: string
  city: string
  owner: {
    id: string
    username: string
    avatarUrl: string
  }
  sharedUsers: {
    id: number
    username: string
    avatarUrl: string
  }[]
}
