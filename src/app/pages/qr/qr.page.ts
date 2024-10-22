import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  handleQrCodeResult(result: string) {
    console.log('QR code result:', result);
  }

}
