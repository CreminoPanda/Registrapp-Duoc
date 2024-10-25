import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private router: Router, private auth:AuthService) { }

  ngOnInit() {
  }

  async logout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

}