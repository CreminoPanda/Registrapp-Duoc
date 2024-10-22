import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';
import { UsuariosService } from 'src/app/services/usuario.service';
import * as CryptoJS from 'crypto-js';

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
    private firestore: AngularFirestore,
    private usuarioService: UsuariosService
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
      const rutSnapshot = await this.firestore.collection('usuarios', ref => ref.where('rut', '==', this.rutValue)).get().toPromise();
      if (rutSnapshot && !rutSnapshot.empty) {
        Swal.fire({
          title: 'Error!',
          text: 'El RUT ya está registrado!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        return;
      }

      const emailSnapshot = await this.firestore.collection('usuarios', ref => ref.where('email', '==', this.emailValue)).get().toPromise();
      if (emailSnapshot && !emailSnapshot.empty) {
        Swal.fire({
          title: 'Error!',
          text: 'El correo electrónico ya está registrado!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        return;
      }

      const usuario = await this.authService.register(this.emailValue, this.passValue);
      const userCreado = usuario.user;

      if (userCreado) {
        const encryptedPass = CryptoJS.AES.encrypt(this.passValue, 'your-secret-key').toString();

        const aux = {
          uid: userCreado.uid,
          email: userCreado.email,
          pass: encryptedPass,
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

  async registroAleatorio() {
    try {
      Swal.fire({
        title: 'Procesando!',
        html: 'Registrando usuarios...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const randomUsers = await this.usuarioService.getRandomUsers(10);
  
      for (const user of randomUsers) {
        const userCredential = await this.authService.register(user.email, user.pass);
        const uid = userCredential.user?.uid;
  
        if (uid) {
          // Encriptar la contraseña
          const encryptedPass = CryptoJS.AES.encrypt(user.pass, 'your-secret-key').toString();

          const userData = {
            uid,
            email: user.email,
            pass: encryptedPass,
            nombre: user.nombre,
            apellido: user.apellido,
            rut: user.rut,
            tipo: user.tipo
          };
  
          await this.firestore.collection('usuarios').doc(uid).set(userData);
        }
      }
  
      Swal.close();
  
      Swal.fire({
        title: 'Éxito!',
        text: 'Usuarios creados correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
  
    } catch (error) {
      console.error('Error registering users:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un error al registrar los usuarios!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }


}