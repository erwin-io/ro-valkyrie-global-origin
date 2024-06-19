import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isHidden = true;
  previousScrollPosition = window.pageYOffset;

  constructor() { }

  ngOnInit(): void { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > this.previousScrollPosition) {
      // Scrolling down
      this.isHidden = false;
    } else {
      // Scrolling up
      this.isHidden = true;
    }

    this.previousScrollPosition = currentScrollPosition;
  }
}
