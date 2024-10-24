import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.page.html',
  styleUrls: ['./actualizar.page.scss'],
})
export class ActualizarPage implements OnInit {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    rut: '',
    tipo: '',
    pass: '',
    uid: ''
  };

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.usuariosService.getUsuarioByUid(uid).subscribe((usuario) => {
        this.usuario = usuario;
      });
    }
  }

  async actualizarUsuario() {
    try {
      await this.usuariosService.updateUsuario(this.usuario);
      const toast = await this.toastController.create({
        message: 'Usuario actualizado con éxito',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.router.navigate(['/admin']); // Cambia esta ruta según tu necesidad
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al actualizar el usuario',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

}