import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen: boolean = false;
  subMenuOpen = {};
  url = '';
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.url = environment.production ? 'https://www.valkyrieorigin.com/' : '';
  }
}
