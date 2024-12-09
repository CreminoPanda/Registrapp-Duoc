import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet'

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
})
export class GeolocalizacionPage {
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  apiKey: string = 'TU_API_KEY'//Aqui va tu api key de google maps
  map: any;

  constructor(private http: HttpClient) { }

  async obtenerUbicacion() {
    try {
      const posicion = await Geolocation.getCurrentPosition();
      this.latitud = posicion.coords.latitude;
      this.longitud = posicion.coords.longitude;
      console.log('Ubicación Obtenida', this.latitud, this.longitud);

      this.obtenerDireccion();

      this.mostrarMapa();
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      alert('Error al obtener la ubicación');
    }
  }

  obtenerDireccion() {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitud},${this.longitud}&key=${this.apiKey}`;
    this.http.get(url).subscribe((response: any) => {
      if (response.status === 'OK' && response.results.length > 0) {
        this.direccion = response.results[0].formatted_address;
      } else {
        this.direccion = 'No se pudo obtener la dirección';
      }
    }, error => {
      console.error('Error al obtener la dirección', error);
      this.direccion = 'No se pudo obtener la dirección';
    })
  }

  mostrarMapa() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([this.latitud, this.longitud], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.marker([this.latitud, this.longitud]).addTo(this.map)
      .bindPopup('Mi Ubicación')
      .openPopup();
  }

  ngOnInit() {
    this.obtenerUbicacion();
  }

}
