import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  emailValue: string = '';
  passValue: string = '';
  nombreValue: string = '';
  apellidoValue: string = '';
  rutValue: string = '';
  loginForm: FormGroup;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async register() {
    if (this.loginForm.invalid) {
      const alert = await Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
      return;
    }

    try {
      const usuario = await this.authService.register(this.emailValue, this.passValue);
      const userCreado = usuario.user;

      if (userCreado) {
        const aux = {
          uid: userCreado.uid,
          email: userCreado.email,
          pass: this.passValue,
          nombre: this.nombreValue,
          apellido: this.apellidoValue,
          rut: this.rutValue,
          tipo: 'usuario'
        };

        await this.firestore.collection('usuarios').doc(userCreado.uid).set(aux);

        let timerInterval: any;
        Swal.fire({
          title: "Procesando!",
          html: "Creando usuario...",
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
              text: 'Usuario creado correctamente!',
              icon: 'success',
              confirmButtonText: 'OK',
              heightAuto: false
            });
            this.router.navigate(['/login']);
          }
        });
      }

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede registrar el usuario!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }
}