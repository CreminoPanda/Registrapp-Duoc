import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  emailValue?: string;
  passValue?: string;
  nombreValue?: string;
  apellidoValue?: string;
  rutValue?: string;
  registerForm: FormGroup;

  constructor(private router: Router, private alertController: AlertController, 
  private loadingController: LoadingController, private formBuilder: FormBuilder, private usuarioService: UsuariosService) { 
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$')]],
      rut: ['', [Validators.required, Validators.pattern('^\\d{1,2}\\.\\d{3}\\.\\d{3}-[\\dkK]$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Z]).{6,}$')]]
    });
  }

  ngOnInit() {
  }

  async register() {
    if (!this.registerForm.valid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const aux: Usuario = {
      email: this.emailValue || '',
      pass: this.passValue || '',
      nombre: this.nombreValue || '',
      apellido: this.apellidoValue || '',
      rut: this.rutValue || '',
      tipo: 'invitado'
    };
    this.usuarioService.addUsuario(aux);
    this.router.navigate(['/login']);
  }

}