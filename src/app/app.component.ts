import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './shared/services/api/authentication.service';
import { ThemeService } from './shared/services/theme/theme.service';
import { RequestService } from './shared/services/api/request.service';
import { VersioningService } from './shared/services/others/versioning.service';
import { Crypto } from './shared/helpers/crypto.helper';

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
