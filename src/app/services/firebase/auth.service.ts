import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {}

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState.pipe(
      map((user) => (user ? user.uid : null))
    );
  }

  login(email: string, pass: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass);
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
