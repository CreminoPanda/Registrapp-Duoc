import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  userMarker: mapboxgl.Marker | null = null;
  lastPosition: { latitude: number; longitude: number } | null = null;
  isWithinRange: boolean = true;

  targetLocation = {
    latitude: -33.59854995097763,
    longitude: -70.57921183581267,
  };

  allowedRange = 100;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeMap();
    this.trackUserLocation();
  }

  async requestLocationPermissions(): Promise<void> {
    try {
      const permission = await Geolocation.requestPermissions();
      if (
        permission.location === 'granted' ||
        permission.location === 'prompt'
      ) {
        console.log('Permiso de ubicación concedido');
        this.centerMapOnUserLocation();
      } else {
        console.error('Permiso de ubicación denegado');
      }
    } catch (error) {
      console.error('Error al solicitar permisos de ubicación:', error);
    }
  }

  async trackUserLocation() {
    Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
      (position, err) => {
        if (err) {
          console.error('Error al obtener ubicación:', err);
          return;
        }

        if (position) {
          const { latitude, longitude } = position.coords;
          console.log('Ubicación obtenida:', latitude, longitude);

          this.lastPosition = { latitude, longitude };

          const distance = this.calculateDistance(
            latitude,
            longitude,
            this.targetLocation.latitude,
            this.targetLocation.longitude
          );

          this.isWithinRange = distance <= this.allowedRange;

          if (this.userMarker) {
            this.userMarker.setLngLat([longitude, latitude]);
          } else {
            this.userMarker = new mapboxgl.Marker({
              color: 'blue',
              scale: 0.5,
            })
              .setLngLat([longitude, latitude])
              .addTo(this.map);
          }
          this.map.flyTo({ center: [longitude, latitude], zoom: 14 });
        }
      }
    );
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  initializeMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibXZjYW11cyIsImEiOiJjbTRwcTFmcGswZmtvMnJvdzBmMjgyYWF1In0.L6RBplYPUQE935YIsBQOdg';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.5, -38.5],
      zoom: 6,
    });

    this.map.on('load', () => {
      console.log('Mapa cargado correctamente');
    });

    this.requestLocationPermissions();
  }

  async centerMapOnUserLocation() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      if (position) {
        const { latitude, longitude } = position.coords;
        console.log('Centrando mapa en la ubicación:', latitude, longitude);

        if (this.userMarker) {
          this.userMarker.setLngLat([longitude, latitude]);
        } else {
          this.userMarker = new mapboxgl.Marker({
            color: 'blue',
            scale: 0.5,
          })
            .setLngLat([longitude, latitude])
            .addTo(this.map);
        }
        this.map.flyTo({ center: [longitude, latitude], zoom: 14 });
      }
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
    }
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}
