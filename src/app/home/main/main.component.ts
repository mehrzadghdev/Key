import { Component, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { SelectOption } from 'src/app/shared/types/common.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public promptEvent: any;
  public faqItems: SelectOption<string>[] = [
    {
      value: 'مراحل دریافت گواهی امضای الکترونیکی CSR چگونه است؟',
      display: `مراحل دریافت گواهی امضای الکترونیکی به طور خلاصه:
      دریافت فایل CSR به کمک نرم افزار واسط کلید (مراکز میانی) https://keyacc.ir/csr
      ثبت نام در سایت www.gica.ir
      ورود به سایت www.gica.ir
      مراجعه به دفتر اسناد رسمی
      برای توضیحات بیشتر به مقاله گواهی امضای الکترونیکی مراجعه کنید. لینک مقاله گواهی امضاء`
    },
    {
      value: 'دریافت شناسه یکتای حافظه مالیاتی چه مراحلی دارد؟',
      display: `بعد از دریافت امضای الکترونیکی، نوبت دریافت شناسه یکتا است. بعبارتی شما پرونده مالیاتی دارید، کلید عمومی، کلید خصوصی، CSR و امضای الکترونیک را گرفته اید.

      حال نوبت دریافت شناسه یکتا است. برای آموزش گام به گام مقاله مراحل دریافت شناسه یکتا را بخوانید.
      
      برای توضیحات بیشتر به مقاله دریافت شناسه یکتای حافظه مالیاتی مراجعه کنید. لینک مقاله دریافت شناسه یکتای حافظه مالیاتی`
    },
    {
      value: 'شناسه کالا و خدمت برای سامانه مودیان رو از کجا دریافت کنم؟',
      display: `شناسه عمومی کالا یا خدمت در سایت https://www.stuffid.tax.gov.ir قابل دریافت است. اما در مالیتور

      لیست کالا یا خدمت با شناسه عمومی قرار دارد.
      
      جهت اضافه کردن شناسه خصوصی از طریق سامانه اقدام کنید. آموزش دریافت شناسه خصوصی کالا یا خدمت`
    },
    {
      value: 'چرا نرم افزار واسط کلید؟',
      display: `شما مودی عزیز می توانید صورتحساب های الکترونیکی خود را به کمک شرکت های معتمد، خرید ماژول های سامانه مودیان بر نرم افزار حسابداری خود و سامانه های مستقل ارسال کنید.

      در نرم افزار واسط سامانه مودیان کلید شما می توانید برای چند شرکت با عنوان مودی فاکتور ارسال کنید. یعنی اگر حسابدار باشید می تونین برای چند شرکت حساب بسازید.
      
      در کلید هزینه اولیه و پشتیبانی سالیانه پرداخت نمی کنید.`
    }
  ]
  constructor(private utility: UtilityService) { }

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
