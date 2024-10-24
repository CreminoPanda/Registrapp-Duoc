import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'usuario-dashboard',
    loadChildren: () => import('./pages/usuario/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'invitado-dashboard',
    loadChildren: () => import('./pages/invitado/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'usuario-profesor',
    loadChildren: () => import('./pages/usuario/profesor/profesor.module').then( m => m.ProfesorPageModule)
  },
  {
    path: 'usuario-cursos',
    loadChildren: () => import('./pages/usuario/cursos/cursos.module').then( m => m.CursosPageModule)
  },
  {
    path: 'detalle-curso',
    loadChildren: () => import('./pages/usuario/detalle-curso/detalle-curso.module').then( m => m.DetalleCursoPageModule)
  },
  {
    path: 'olvide-contra',
    loadChildren: () => import('./pages/olvide-contra/olvide-contra.module').then( m => m.OlvideContraPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./pages/qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'actualizar-usuario/:uid',
    loadChildren: () => import('./pages/admin/actualizar/actualizar.module').then( m => m.ActualizarPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
