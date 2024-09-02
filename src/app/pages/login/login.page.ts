import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailValue?: string;
  passValue?: string;
  loginForm: FormGroup;

  constructor(private router:Router, private alertController:AlertController, 
  private loadingController:LoadingController, private formBuilder:FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  async login() {
    const email = this.emailValue;
    const pass = this.passValue;

    if( email === 'admin@admin.cl' && pass == 'admin123') {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 2000
      });
      await loading.present();

      localStorage.setItem('usuarioLogin',email);

      setTimeout(async() => {
        await loading.dismiss();
        this.router.navigate(['home']);
      },2000)

    } else {
      const alert = await this.alertController.create({
        header: 'Acceso denegado',
        message: 'Usuario o contraseña incorrectas!',
        buttons: ['OK']
      });
      await alert.present();
    }

  }
  navigateRegister() {
    this.router.navigate(['register']);
  }


}
