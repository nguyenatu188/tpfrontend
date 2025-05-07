// export type Trip = {
//   id: number
//   title: string
//   startDate: string
//   endDate: string
//   country: string
//   city: string
//   owner: {
//     id: string
//     username: string
//     avatarUrl: string
//   }
//   sharedUsers: {
//     id: number
//     username: string
//     avatarUrl: string
//   }[]
// }

export interface Trip {
  id: number;
  title: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  privacy: "PUBLIC" | "PRIVATE";
  isActive: boolean;
  owner?: {
    username: string;
    avatarUrl: string;
    id: string;
  };
  sharedUsers?: {
    id: number;
    username: string;
    avatarUrl: string;
  }[];
}