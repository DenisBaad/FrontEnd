import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filter, fromEvent, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, NavigationEnd, RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { CustomMatPaginatorIntl } from './shared/directives/custom-mat-paginator-init';
import { MenuItem } from './shared/models/interfaces/responses/menu-item';
import { ToolbarMenuComponent } from './shared/components/toolbar-menu/toolbar-menu.component';
import { ImageControlComponent } from './shared/components/image-control/image-control.component';
import { menuItems } from './shared/models/interfaces/responses/menu';
export const TEXT_LIMIT = 50;
export const SHADOW_LIMIT = 100;
export const SCROLL_CONTAINER = 'mat-sidenav-content';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToolbarMenuComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    RouterModule,
    MatListModule,
    ImageControlComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    { provide: DateAdapter, useClass: NativeDateAdapter },
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  expandedIndex: number | null = null;
  public isSmallScreen = false;
  public popText = false;
  public applyShadow = false;
  public items_menu: MenuItem[] = menuItems;
  private cookie = inject(CookieService);
  public menuName: string = '';
  firstFormGroup!: FormGroup;
  public imageUrl: string = "";
  isRounded: boolean = false;
  public USUARIO_INFO= this.cookie.get('USUARIO_INFORMACOES');
  public USUARIO_LOGADO = this.cookie.get('USUARIO_NOME');

  constructor(private fb: FormBuilder, private route: Router, private activeRoute: ActivatedRoute, private breakpointObserver: BreakpointObserver) {
    this.firstFormGroup = this.fb.group({
      base64Image: [''],
    });
  }

  ngOnInit(): void {
    this.initializeFromLocalStorage();
    const content = document.getElementsByClassName(SCROLL_CONTAINER)[0];

    fromEvent(content, 'scroll')
      .pipe(map(() => content.scrollTop))
      .subscribe((value: number) => this.determineHeader(value))

    this.route.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.menuName = this.activeRoute.firstChild?.snapshot.routeConfig?.path ?? '';
      this.menuName = this.menuName.replace(/-/g, ' ');
    });
  }

  initializeFromLocalStorage(): void {
    const savedImage = localStorage.getItem('imageUrl');
    const savedIsRounded = localStorage.getItem('isRounded');

    if (savedImage) {
      this.imageUrl = savedImage;
    }

    if (savedIsRounded !== null) {
      this.isRounded = JSON.parse(savedIsRounded);
    }
  }

  toggleImageShape(): void {
    this.isRounded = !this.isRounded;
    localStorage.setItem('isRounded', JSON.stringify(this.isRounded));
  }

  determineHeader(scrollTop: number) {
    this.popText = scrollTop >= TEXT_LIMIT;
    this.applyShadow = scrollTop >= SHADOW_LIMIT;
  }

  ngAfterContentInit(): void {
    this.breakpointObserver
        .observe(['(max-width: 800px)'])
        .subscribe((res) => this.isSmallScreen = res.matches);
  }

  get sidenavMode() {
    return this.isSmallScreen ? 'over' : 'side';
  }

  toggleSubMenu(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
