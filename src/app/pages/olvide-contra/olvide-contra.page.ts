import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController} from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-olvide-contra',
  templateUrl: './olvide-contra.page.html',
  styleUrls: ['./olvide-contra.page.scss'],
})
export class OlvideContraPage implements OnInit {

  emailValue?: string;
  recoverForm: FormGroup;

  constructor(
    private alertController: AlertController, private loadingController: LoadingController, private formBuilder: FormBuilder, private usuarioService: UsuariosService, private router: Router) {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async recoverPassword() {
    const email = this.emailValue;
    const aux = this.usuarioService.getUsuario();
    const user = aux.find(aux => aux.email === email);

    if (user) {
      const loading = await this.loadingController.create({
        message: 'Enviando correo...',
        duration: 2000
      });
      await loading.present();
      setTimeout(async () => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Correo enviado',
          message: 'Se ha enviado un correo para recuperar su contraseña.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }]
        });
        await alert.present();
      }, 2000);
    } else {
      const alert = await this.alertController.create({
        header: 'Correo no encontrado',
        message: 'El correo ingresado no está registrado.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}