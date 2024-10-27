import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'splashscreen',
    loadChildren: () =>
      import('./pages/splashscreen/splashscreen.module').then(
        (m) => m.SplashscreenPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },

  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./pages/admin/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'usuario-dashboard',
    loadChildren: () =>
      import('./pages/usuario/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'invitado-dashboard',
    loadChildren: () =>
      import('./pages/invitado/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'usuario-profesor',
    loadChildren: () =>
      import('./pages/usuario/profesor/profesor.module').then(
        (m) => m.ProfesorPageModule
      ),
  },
  {
    path: 'usuario-cursos',
    loadChildren: () =>
      import('./pages/usuario/cursos/cursos.module').then(
        (m) => m.CursosPageModule
      ),
  },
  {
    path: 'detalle-curso',
    loadChildren: () =>
      import('./pages/usuario/detalle-curso/detalle-curso.module').then(
        (m) => m.DetalleCursoPageModule
      ),
  },
  {
    path: 'olvide-contra',
    loadChildren: () =>
      import('./pages/olvide-contra/olvide-contra.module').then(
        (m) => m.OlvideContraPageModule
      ),
  },
  {
    path: 'actualizar-usuario/:uid',
    loadChildren: () =>
      import('./pages/admin/actualizar/actualizar.module').then(
        (m) => m.ActualizarPageModule
      ),
  },
  {
    path: 'lista-usuarios',
    loadChildren: () =>
      import(
        './pages/admin/usuarios/lista-usuarios/lista-usuarios.module'
      ).then((m) => m.ListaUsuariosPageModule),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./pages/admin/usuarios/usuarios/usuarios.module').then(
        (m) => m.UsuariosPageModule
      ),
  },
  {
    path: 'crear-asignatura',
    loadChildren: () =>
      import('./pages/admin/crear-asignatura/crear-asignatura.module').then(
        (m) => m.CrearAsignaturaPageModule
      ),
  },
  {
    path: 'asignaturas',
    loadChildren: () =>
      import('./pages/admin/asignaturas/asignaturas.module').then(
        (m) => m.AsignaturasPageModule
      ),
  },
  {
    path: 'listar-asignaturas',
    loadChildren: () =>
      import('./pages/admin/listar-asignaturas/listar-asignaturas.module').then(
        (m) => m.ListarAsignaturasPageModule
      ),
  },
  {
    path: 'crear-seccion',
    loadChildren: () =>
      import('./pages/admin/crear-seccion/crear-seccion.module').then(
        (m) => m.CrearSeccionPageModule
      ),
  },
  {
    path: 'listar-seccion',
    loadChildren: () =>
      import('./pages/admin/listar-seccion/listar-seccion.module').then(
        (m) => m.ListarSeccionPageModule
      ),
  },
  {
    path: 'generar-qr',
    loadChildren: () =>
      import('./pages/usuario/generar-qr/generar-qr.module').then(
        (m) => m.GenerarQrPageModule
      ),
  },
  {
    path: 'escanear-qr',
    loadChildren: () =>
      import('./pages/invitado/escanear-qr/escanear-qr.module').then(
        (m) => m.EscanearQrPageModule
      ),
  },
  {
    path: 'asignar-asignaturas/:profesorUid',
    loadChildren: () =>
      import(
        './pages/admin/asignar-asignaturas/asignar-asignaturas.module'
      ).then((m) => m.AsignarAsignaturasPageModule),
  },
  {
    path: 'ver-secciones/:asignaturaUid',
    loadChildren: () =>
      import('./pages/usuario/ver-secciones/ver-secciones.module').then(
        (m) => m.VerSeccionesPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
