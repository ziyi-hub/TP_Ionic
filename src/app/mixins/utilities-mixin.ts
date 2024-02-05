import { inject } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular/standalone";

export class UtilitiesMixin {
  private readonly toastController =  inject(ToastController);
  private readonly alertController =  inject(AlertController);

  /**
   * show toast
   * @param message
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

  /**
   * show a confirm alert before delete
   * @param deleteCallback
   * @param topicId
   * @param topicName
   */
  async presentAlertDelete(deleteCallback: (topicId: string) => void, topicId: string, topicName: string) {
    const alert = await this.alertController.create({
      header: 'Delete Item',
      subHeader: 'Are you sure you want to delete ' + topicName + "?",
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            deleteCallback(topicId);
          },
        },
      ],
    });

    await alert.present();
  }
}
