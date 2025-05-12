import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, TranslateModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sectionTitle = '';
  currentYear = new Date().getFullYear();
  menuOpen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('en');

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.sectionTitle = (data as any)['title'] || '';
      });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
