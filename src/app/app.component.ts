import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { ThemeService } from './shared/services/theme.service';
import { RequestService } from './shared/services/request.service';
import { VersioningService } from './shared/services/versioning.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private themeService: ThemeService,
    private versioningService: VersioningService,
  ) { }

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
