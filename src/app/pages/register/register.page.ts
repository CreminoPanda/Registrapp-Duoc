import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  emailValue?: string;
  passValue?: string;
  confirmpassValue?: string;
  nombreValue?: string;
  apellidoValue?: string;
  rutValue?: string;
  registerForm: FormGroup;

  constructor(private router:Router, private alertController:AlertController, 
    private loadingController:LoadingController, private formBuilder:FormBuilder) { 
      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        rut: ['', Validators.required],
        password: ['',[Validators.required,Validators.minLength(6)]]
      })
    }

  ngOnInit() {
  }

  async register() {
    const email = this.emailValue;
    const pass = this.passValue;
    const nombre = this.nombreValue;
    const apellido = this.apellidoValue;
    const rut = this.rutValue;

    if(email === 'admin@admin.cl' && pass == 'admin123' && nombre && apellido && rut) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 2000
      });
      await loading.present();
    
      setTimeout(async() => {
        await loading.dismiss();
        this.router.navigate(['login']);
      }, 2000);
    } else {
      const alert = await this.alertController.create({
        header: 'Acceso denegado, todos los campos deben de estar completos',
        message: 'Faltan datos o las contraseñas no coinciden',
        buttons: ['Ok']
      });
      await alert.present();
    }

  }

}
