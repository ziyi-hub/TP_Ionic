export interface Recipe {
  id: string;
  name: string;
  imgUrl: string;
  serving:number;
  duration:string;
  owner : string;
  steps?: string[];
  ingredients? : string[];
  tags? : string[];
  readers? : string[];
  editors? : string[];
  createdAt? : Date;
  updatedAt? : Date;
}
