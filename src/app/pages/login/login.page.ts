import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailValue?: string;
  passValue?: string;
  loginForm: FormGroup;

  constructor(private router: Router, private alertController: AlertController, private loadingController: LoadingController, private formBuilder: FormBuilder,
    private usuarioService: UsuariosService, private menuController:MenuController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  async login() {
    const email = this.emailValue;
    const pass = this.passValue;
    const aux = this.usuarioService.getUsuario();

    const user = aux.find(aux => aux.email === email && aux.pass === pass);

    if (user) {
      const loading = await this.loadingController.create({
        message: 'Cargando......',
        duration: 2000
      });

      await loading.present();

      localStorage.setItem('usuarioLogin', JSON.stringify(user));

      setTimeout(async() => {
        await loading.dismiss();

        if (user.tipo === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (user.tipo === 'usuario') {
          this.router.navigate(['/usuario-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      }, 2000);
      

    } else {
      const alert = await this.alertController.create({
        header: 'Acceso denegado',
        message: 'Usuario o contraseña incorrectas!',
        buttons: ['OK']
      });
      await alert.present();
    }

    
  }
}
