import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  emailValue?: string;
  passValue?: string;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private menuController: MenuController,
    private firestore: AngularFirestore
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
    try {
      const email = this.emailValue;
      const pass = this.passValue;

      const usuarioLogeado = await this.authService.login(
        email as string,
        pass as string
      );

      if (usuarioLogeado.user) {
        await this.handleLoginSuccess(usuarioLogeado);
      }
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  async loginWithGoogle() {
    try {
      const usuarioLogeado = await this.authService.loginWithGoogle();
      if (usuarioLogeado.user) {
        await this.handleLoginSuccess(usuarioLogeado, true);
      }
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  async loginWithGitHub() {
    try {
      const usuarioLogeado = await this.authService.loginWithGitHub();
      if (usuarioLogeado.user) {
        await this.handleLoginSuccess(usuarioLogeado, true);
      }
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  private async handleLoginSuccess(
    usuarioLogeado: any,
    isSocialLogin: boolean = false
  ) {
    const loading = await this.loadingController.create({
      message: 'Cargando......',
      duration: 2000,
    });

    await loading.present();

    const usuario = await this.firestore
      .collection('usuarios')
      .doc(usuarioLogeado.user.uid)
      .get()
      .toPromise();
    const userData = usuario?.data() as Usuario;

    setTimeout(async () => {
      await loading.dismiss();

      if (isSocialLogin) {
        this.router.navigate(['/invitado-dashboard']);
      } else {
        if (userData.tipo === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userData.tipo === 'alumno') {
          this.router.navigate(['/invitado-dashboard']);
        } else if (userData.tipo === 'profesor') {
          this.router.navigate(['/usuario-profesor']);
        } else {
          this.router.navigate(['/home']);
        }
      }
    }, 2000);
  }

  private handleLoginError(error: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Acceso denegado! credenciales no válidas.',
    });
    console.error('Error al iniciar sesión:', error);
  }
}
