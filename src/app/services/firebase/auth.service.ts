import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  login(email: string, pass: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass);
  }

  loginWithGoogle() {
    return this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(error => {
        console.error('Error al autenticar con Google: ', error);
        throw error;
      })
  }

  loginWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider)
      .then(result => {
        console.log('Autenticado con GitHub: ', result);
        return result;
      })
      .catch(error => {
        console.error('Error al autenticar con GitHub: ', error);
        throw error;
      })
  }

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState.pipe(
      map((user) => (user ? user.uid : null))
    );
  }

  register(email: string, pass: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);
  }

  logout() {
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
}
