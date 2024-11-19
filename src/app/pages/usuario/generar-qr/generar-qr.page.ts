import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as qrcode from 'qrcode';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  asignaturaUid: string = '';
  seccionUid: string = '';
  qrCode: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.asignaturaUid =
      this.route.snapshot.paramMap.get('asignaturaUid') || '';
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.generarQrParaSeccion();
  }

  async generarQrParaSeccion() {
    const qrData = { seccionUid: this.seccionUid };
    const qrContent = JSON.stringify(qrData);
    try {
      this.qrCode = await qrcode.toDataURL(qrContent);
    } catch (err) {
      console.error(err);
    }
  }
}
