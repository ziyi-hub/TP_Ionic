export interface Recipe {
  id: string;
  name: string;
  serving:number;
  duration:string;
  steps: [];
  ingredients : [];
  tags : [];
  readers : [];
  createdAt? : Date;
  updatedAt? : Date;
}
