import { Recipe } from "./recipe";

export interface Category {
  id: string;
  name: string;
  imgUrl : string;
  recipes?: Recipe[];
  readers? : string[];
  editors? : string[];
  owner? : string;
  createdAt?: Date;
  updatedAt?: Date;
}
