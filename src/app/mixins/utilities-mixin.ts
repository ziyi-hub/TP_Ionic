import { inject } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";

export class UtilitiesMixin {
  private readonly toastController =  inject(ToastController);
     /**
   * show toast
   * @param message
   * @param position
   * @param color
   */
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: color
    });
    await toast.present();
  }
}