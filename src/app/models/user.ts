export interface User {
  id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  imgUrl?:string;
  createdAt?: Date;
  updatedAt?: Date;
}