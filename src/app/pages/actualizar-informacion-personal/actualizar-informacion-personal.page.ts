import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-actualizar-informacion-personal',
  templateUrl: './actualizar-informacion-personal.page.html',
  styleUrls: ['./actualizar-informacion-personal.page.scss'],
})
export class ActualizarInformacionPersonalPage implements OnInit {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    rut: '',
    tipo: '',
    pass: '',
    uid: '',
  };

  updateForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private toastController: ToastController,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.updateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      rut: [
        '',
        [Validators.required, Validators.pattern('^\\d{7,8}-[\\dkK]$')],
      ],
      tipo: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.authService.isLogged().subscribe((uid: string | null) => {
      if (uid) {
        this.usuariosService.getUsuarioByUid(uid).subscribe((usuario) => {
          this.usuario = usuario;
          this.updateForm.patchValue(usuario);
        });
      }
    });
  }

  async actualizarUsuario() {
    if (this.updateForm.invalid) {
      await Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    try {
      const encryptedPass = CryptoJS.AES.encrypt(
        this.usuario.pass,
        'your-secret-key'
      ).toString();
      const updatedData = {
        ...this.usuario,
        ...this.updateForm.value,
        pass: encryptedPass,
      };

      await this.usuariosService.updateUsuario(updatedData);
      await Swal.fire({
        title: 'Éxito!',
        text: 'Usuario actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false,
      });

      // Obtener el tipo de usuario actualizado y redirigir
      this.authService.isLogged().subscribe(async (uid: string | null) => {
        if (uid) {
          const usuarioActualizado = await this.usuariosService
            .getUsuarioByUid(uid)
            .toPromise();
          if (usuarioActualizado) {
            if (usuarioActualizado.tipo === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (usuarioActualizado.tipo === 'alumno') {
              this.router.navigate(['/invitado-dashboard']);
            } else if (usuarioActualizado.tipo === 'profesor') {
              this.router.navigate(['/cursos']);
            } else {
              this.router.navigate(['/home']);
            }
          }
        }
      });
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Error al actualizar el usuario',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
    }
  }

  navigateBack() {
    if (this.usuario.tipo === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.usuario.tipo === 'alumno') {
      this.router.navigate(['/invitado-dashboard']);
    } else if (this.usuario.tipo === 'profesor') {
      this.router.navigate(['/usuario-profesor']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}