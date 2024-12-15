import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isDevelopmentMode: boolean = false; // Cambia esto a false en producción

  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  async login(email: string, password: string): Promise<any> {
    if (!this.isDevelopmentMode) {
      await this.checkHuellaDigital();
    }
    const userCredential =
      await this.angularFireAuth.signInWithEmailAndPassword(email, password);
    localStorage.setItem(
      'user',
      JSON.stringify({ uid: userCredential.user?.uid, email, password })
    );
    return userCredential;
  }

  async loginWithGoogle() {
    if (!this.isDevelopmentMode) {
      await this.checkHuellaDigital();
    }
    return this.angularFireAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error) => {
        console.error('Error al autenticar con Google: ', error);
        throw error;
      });
  }

  async loginWithGitHub() {
    if (!this.isDevelopmentMode) {
      await this.checkHuellaDigital();
    }
    const provider = new firebase.auth.GithubAuthProvider();
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('Autenticado con GitHub: ', result);
        return result;
      })
      .catch((error) => {
        console.error('Error al autenticar con GitHub: ', error);
        throw error;
      });
  }

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (user) {
          localStorage.setItem(
            'user',
            JSON.stringify({ uid: user.uid, email: user.email })
          );
          return user.uid;
        } else {
          localStorage.removeItem('user');
          return null;
        }
      })
    );
  }

  register(email: string, pass: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);
  }

  logout() {
    localStorage.removeItem('user');
    return this.angularFireAuth.signOut();
  }

  recoveryPassword(email: string) {
    return this.angularFireAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Correo enviado!');
      })
      .catch((error) => {
        console.log('No se pudo enviar el correo!');
        throw error;
      });
  }

  async checkHuellaDigital() {
    try {
      const result = await NativeBiometric.isAvailable();
      if (result.isAvailable) {
        await NativeBiometric.verifyIdentity({
          reason: 'Por favor, autentícate para continuar',
          title: 'Autenticación Biométrica',
          subtitle: 'Usa tu huella digítal o Face ID',
          description: 'Coloca tu huella en el sensor para ingresar.',
        });
      } else {
        throw new Error('Autenticación biométrica no disponible');
      }
    } catch (error) {
      try {
        await NativeBiometric.verifyIdentity({
          reason: 'Por favor, autentícate para continuar',
          title: 'Autenticación del Dispositivo',
          subtitle: 'Usa tu PIN, contraseña o patrón',
          description:
            'Usa el método de protección de tu dispositivo para ingresar.',
        });
      } catch (error) {
        throw new Error('Autenticación fallida');
      }
    }
  }

  async autoLogin(): Promise<any> {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      try {
        const userCredential =
          await this.angularFireAuth.signInWithEmailAndPassword(
            userData.email,
            userData.password
          );
        return userCredential.user;
      } catch (error) {
        console.error('Error al iniciar sesión automáticamente', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  async checkSessionWithFingerprint(): Promise<any> {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        if (!this.isDevelopmentMode) {
          await this.checkHuellaDigital();
        }
        return JSON.parse(user);
      } catch (error) {
        console.error('Autenticación por huella digital fallida', error);
        this.logout();
        return null;
      }
    }
    return null;
  }
}
