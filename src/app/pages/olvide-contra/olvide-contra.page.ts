import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvide-contra',
  templateUrl: './olvide-contra.page.html',
  styleUrls: ['./olvide-contra.page.scss'],
})
export class OlvideContraPage implements OnInit {

  emailValue: string = '';
  recoverForm: FormGroup;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async recoverPassword() {
    if (this.recoverForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.recoveryPassword(this.emailValue);
      let timerInterval: any;
      Swal.fire({
        title: "Procesando!",
        html: "Enviando correo...",
        timer: 1500,
        timerProgressBar: true,
        heightAuto: false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()!.querySelector("b");
          timerInterval = setInterval(() => {
            timer!.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          Swal.fire({
            title: 'Éxito!',
            text: 'Correo enviado correctamente!',
            icon: 'success',
            confirmButtonText: 'OK',
            heightAuto: false
          }).then(() => {
            this.router.navigate(['home']);
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede enviar el correo al usuario!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }
}