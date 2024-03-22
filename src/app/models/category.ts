import { Recipe } from "./recipe";

export interface Category {
  id: string;
  name: string;
  imgUrl : string;
  recipes?: Recipe[];
  owner : string;
  createdAt?: Date;
  updatedAt?: Date;
}
