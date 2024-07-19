import { Component, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public promptEvent: any;

  constructor(private utility: UtilityService) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  public onbeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.promptEvent = e;
  }

  public onInstallPwa(): void {
    if (!this.promptEvent) {
      this.utility.message("نرم افزار در سیستم عامل فعلی نصب میباشد", "تایید");
      return
    }

    this.promptEvent.prompt();
  }
}
