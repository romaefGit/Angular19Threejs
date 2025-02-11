import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavOptions } from '../../core/models/nav-options.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  sections: NavOptions[] = [
    {
      name: 'Lighting',
      path: '/lighting',
    },
    {
      name: 'Textures and materials',
      path: '/textures-and-materials',
    },
    {
      name: 'Geometry',
      path: '/geometry',
    },

    {
      name: 'Animation',
      path: '/animation',
    },

    {
      name: 'Particles',
      path: '/particles',
    },

    {
      name: '',
      path: 'https://github.com/romaefGit/Angular19Threejs',
      icon: '/assets/icons/github.avif',
    },
  ];

  isOpen = false;
  activePath: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.activePath = this.router.url;
    });
  }

  openNav() {
    this.isOpen = true;
  }

  closeNav() {
    this.isOpen = false;
  }
}
