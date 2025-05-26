import { Trip } from "./trip";

export interface User {
  id: string
  username: string
  fullname: string
  email?: string
  gender?: "male" | "female"
  avatarUrl?: string
  createdAt?: string
  followersCount?: number
  followingCount?: number
  isFollowing?: boolean
  trips?: Trip[]
  
  followers?: Follower[]
  following?: Following[]
}

interface Follower {
  id: string
  username: string
  fullname: string
  avatarUrl?: string
  followedAt: string
}

interface Following {
  id: string
  username: string
  fullname: string
  avatarUrl?: string
  followedAt: string
}