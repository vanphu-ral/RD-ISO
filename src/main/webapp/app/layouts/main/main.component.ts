import { Component, inject, OnInit, RendererFactory2, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { LayoutService } from '../service/layout.service';
import { LoginService } from 'app/login/login.service';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { SharedModule } from 'app/shared.module';

@Component({
  selector: 'jhi-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, FooterComponent, PageRibbonComponent, SharedModule, RouterModule, HasAnyAuthorityDirective],
})
export default class MainComponent implements OnInit {
  private renderer: Renderer2;
  isMobile: boolean = false;
  account = inject(AccountService).trackCurrentAccount();

  IsShowNavbar: boolean = false;
  private clickListener: (() => void) | undefined;
  @ViewChild('sidebarId') sidebarElement!: ElementRef;
  @ViewChild('sidebarToggleButton') toggleButton!: ElementRef;

  private router = inject(Router);
  private appPageTitleStrategy = inject(AppPageTitleStrategy);
  private accountService = inject(AccountService);
  private translateService = inject(TranslateService);
  private rootRenderer = inject(RendererFactory2);
  private layoutService = inject(LayoutService);
  private loginService = inject(LoginService);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
  }
  closeNav(): void {
    document.getElementById('main')!.style.marginLeft = '85px';
  }

  closeNav2(): void {
    document.getElementById('main')!.style.marginLeft = '85px';
  }

  openNav(): void {
    document.getElementById('main')!.style.marginLeft = '300px';
    // document.getElementById('main')!.style.width = '87vw';
  }

  login(): void {
    this.loginService.login();
  }

  logout(): void {
    this.closeMenubar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleSidebar() {
    this.IsShowNavbar = !this.IsShowNavbar;
    document.getElementById('sidebar-id')!.classList.toggle('collapsed');
    // document.getElementById('sidebar-id')?.style.setProperty('align-items', this.IsShowNavbar ? 'center' : '');
    document.getElementById('sidebar-id')?.style.setProperty('justify-content', this.IsShowNavbar ? 'center' : 'flex-end');

    const sidebar = this.sidebarElement.nativeElement;
    const toggleBtn = this.toggleButton.nativeElement;
    if (this.IsShowNavbar) {
      this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        const clickedInsideMenubar = sidebar.contains(event.target);
        const clickedOnToggleButton = toggleBtn.contains(event.target);
        if (!clickedInsideMenubar && !clickedOnToggleButton) {
          this.closeMenubar();
        }
      });
    } else {
      this.unsubscribeClickListener();
    }
  }

  closeMenubar() {
    this.IsShowNavbar = false;
    const sidebar = this.sidebarElement.nativeElement;
    this.renderer.removeClass(sidebar, 'collapsed');
    this.renderer.setStyle(sidebar, 'align-items', '');
    this.renderer.setStyle(sidebar, 'justify-content', 'flex-end');
    this.unsubscribeClickListener();
  }

  private unsubscribeClickListener() {
    if (this.clickListener) {
      this.clickListener();
      this.clickListener = undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribeClickListener();
  }
}
