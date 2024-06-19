import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen: boolean = false;
  subMenuOpen = {};
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
