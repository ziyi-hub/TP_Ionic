import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, DocumentData, serverTimestamp, query, where, or } from '@angular/fire/firestore';
import { Observable, first, map, switchMap } from 'rxjs';
import { Category } from '../models/category';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  
  private readonly firestore = inject(Firestore);
  private readonly categoryCollection = collection(this.firestore, 'categories');
  
  /**
   * Retrieve all private categories 
   * @returns Observable array of categories
   **/
  getPrivateCategories(username : string): Observable<Category[]> {

    return collectionData(query(this.categoryCollection, where("owner", "==", username)), { idField: 'id' }) as Observable<Category[]>
  }

  /**
   * Retrieve all shared categories 
   * @returns Observable array of categories
   **/
  getSharedCategories(username : string): Observable<Category[]> {
    return collectionData(query(this.categoryCollection, or(where("editors", "array-contains", username), where("readers", "array-contains", username))), { idField: 'id' }) as Observable<Category[]>
  }
  
  /**
   * Retrieve a category (owned and shared) by its identifier. 
   * @param categoryId Category ID
   * @returns Observable of the category with the specified ID
   */
  getCategoryById(categoryId: string, username : string): Observable<Category | undefined> {
    return (collectionData(query(this.categoryCollection, or(where("owner", "==", username), where("editors", "array-contains", username), where("readers", "array-contains", username))), { idField: 'id' }) as Observable<Category[]>
    ).pipe(
      map(categories => categories.find(category => category.id === categoryId))
    );
  }

  /**
   * Retrieve all recipes of a category.
   * @param categoryId Category ID
   * @returns Observable array of recipes for the specified category
   */
  getRecipesByCategoryId(categoryId: string, username : string): Observable<Recipe[] | undefined> {
   const recipeCollection = collection(this.firestore, 'categories/' + categoryId + '/recipes');
   return collectionData(query(recipeCollection, or(where("editors", "array-contains", username), where("readers", "array-contains", username), where("owner", "==", username))), { idField: 'id' }) as Observable<Recipe[]>;
  }


  /**
   * Retrieve a recipe by its ID.
   * @param categoryId Category ID
   * @param recipeId Recipe ID
   * @returns Observable of the recipe with the specified ID
   */
  getRecipe(categoryId: string, recipeId: string, username : string): Observable<Recipe | undefined> {
    return this.getCategoryById(categoryId, username).pipe(
      switchMap((category) => {
        if (category) {
          return this.getRecipesByCategoryId(categoryId, username).pipe(
            map(recipes => recipes!.find(recipe => recipe.id === recipeId))
          );
        } else {
          throw new Error('Category not found or does not contain recipes.');
        }
      })
    );
  }
  getConnectedUser(){

  }
  /**
   * Add a new category to Firestore.
   * @param category The category to add
   * @returns Promise that resolves with the added category
   * @throws Error if the category name is not provided
   */
  async addCategory(category: Category): Promise<Category> {
    if (!category.name) throw new Error('Category name is required');
    const categoryValue = {
      name: category.name,
      imgUrl: category.imgUrl || '',
      owner: category.owner,
      readers: category.readers || [],
      editors: category.editors || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(this.firestore, 'categories'), categoryValue);
    return { ...category, id: docRef.id};
  }

  /**
   * Update an existing category in Firestore.
   * @param categoryToUpdate The category to update
   * @returns Promise that resolves with the updated category
   * @throws Error if the category ID is not provided
   */
  async updateCategory(categoryToUpdate: Category): Promise<Category> {
    if (!categoryToUpdate.id) throw new Error('Category id is required');
    const categoryValue = {
      name: categoryToUpdate.name,
      imgUrl: categoryToUpdate.imgUrl || '',
      owner: categoryToUpdate.owner,
      readers: categoryToUpdate.readers || [],
      editors: categoryToUpdate.editors || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const categoryDocRef = doc(collection(this.firestore, 'categories'), categoryToUpdate.id);
    await updateDoc(categoryDocRef, categoryValue);
    return categoryToUpdate;
  }

  /**
   * Delete a category from Firestore.
   * @param categoryId The ID of the category to delete
   * @returns Promise that resolves with a boolean indicating success
   * @throws Error if the category ID is not provided
   */
  async deleteCategory(categoryId: string): Promise<boolean> {
    if (!categoryId) throw new Error('Category id is required');
    const categoryDocRef = doc(collection(this.firestore, 'categories'), categoryId);
    await deleteDoc(categoryDocRef);
    return true;
  }

  /**
   * Add a new recipe to a category in Firestore.
   * @param recipe The recipe to add
   * @param categoryId The ID of the category to add the recipe to
   * @returns Promise that resolves with the added recipe
   * @throws Error if the recipe name or description is not provided
   */
  async addRecipe(recipe: Recipe, categoryId: string): Promise<Recipe> {
    if (!recipe.name || !recipe.duration || !recipe.serving || !recipe.steps || !recipe.ingredients) throw new Error('Name, duration,serving, steps and ingredients are required');
    const recipeCollectionRef = collection(this.firestore, `categories/${categoryId}/recipes`);
    const recipeValue = {
      name: recipe.name,
      duration: recipe.duration,
      serving: recipe.serving,
      owner : recipe.owner,
      steps: recipe.steps,
      ingredients: recipe.ingredients,
      tags: recipe.tags,
      readers: recipe.readers,
      editors: recipe.editors,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const docRef = await addDoc(recipeCollectionRef, recipeValue);
    return { ...recipe, id: docRef.id };
  }

  /**
   * Update an existing recipe in a category in Firestore
   * @param updatedRecipe The recipe to update
   * @param categoryId The ID of the category containing the recipe
   * @returns Promise that resolves with the updated recipe
   * @throws Error if the recipe ID is not provided
   */
  async updateRecipe(updatedRecipe: Recipe, categoryId: string): Promise<Recipe> {
    if (!categoryId || !updatedRecipe.name || !updatedRecipe.duration || !updatedRecipe.serving || !updatedRecipe.steps || !updatedRecipe.ingredients) throw new Error('Name, duration,serving, steps and ingredients are required');
    const recipeDocRef = doc(collection(this.firestore, `categories/${categoryId}/recipes`), updatedRecipe.id);
    const recipeValue = {
      name: updatedRecipe.name,
      duration: updatedRecipe.duration,
      serving: updatedRecipe.serving,
      owner: updatedRecipe.owner,
      steps: updatedRecipe.steps,
      ingredients: updatedRecipe.ingredients,
      tags: updatedRecipe.tags,
      readers: updatedRecipe.readers,
      editors: updatedRecipe.editors,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    await updateDoc(recipeDocRef, recipeValue);
    return updatedRecipe;
  }

  /**
    * Delete a recipe from a category.
    * @param recipeId The ID of the recipe to delete
    * @param categoryId The ID of the category containing the recipe
    * @returns Promise that resolves with a boolean indicating succe s s 
    * @throws Error if the recipe ID or category ID is not provided
  */
  async deleteRecipe(recipeId: string, categoryId: string, username : string): Promise<boolean> {
    if (!recipeId || !categoryId) throw new Error('Recipe id and category id are required');
    const recipeDocRef = doc(collection(this.firestore, `categories/${categoryId}/recipes`), recipeId);
    await deleteDoc(recipeDocRef);
    return true;   
  }

}