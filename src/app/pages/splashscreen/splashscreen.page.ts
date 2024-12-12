import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      const user = await this.authService.checkSessionWithFingerprint();
      if (user) {
        try {
          const loading = await this.loadingController.create({
            message: 'Cargando......',
            duration: 2000,
          });

          await loading.present();

          const usuario = await this.firestore
            .collection('usuarios')
            .doc(user.uid)
            .get()
            .toPromise();
          const userData = usuario?.data() as Usuario;

          setTimeout(async () => {
            await loading.dismiss();

            if (userData.tipo === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (userData.tipo === 'alumno') {
              this.router.navigate(['/invitado-dashboard']);
            } else if (userData.tipo === 'profesor') {
              this.router.navigate(['/usuario-profesor']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 2000);
        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/home']);
      }
    }, 2000);
  }
}
