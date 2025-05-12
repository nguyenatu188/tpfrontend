export type Trip = {
  id: string
  title: string
  startDate: string
  endDate: string
  country: string
  city: string
  privacy: "PUBLIC" | "PRIVATE"
  lat?: number
  lng?: number
  owner: {
    id: string
    username: string
    avatarUrl: string
  }
  sharedUsers: {
    id: string
    username: string
    avatarUrl: string
  }[]
}
