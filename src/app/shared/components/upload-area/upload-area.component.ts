import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UtilityService } from '../../services/utilities/utility.service';

@Component({
  selector: 'key-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.scss']
})
export class UploadAreaComponent {
  @ViewChild('fileInput', { static: false })
  private fileInput!: ElementRef<HTMLInputElement>;

  @Input('allowdFileTypes')
  public allowedFileTypes: string[] = ['*'];
  @Input('height')
  public height: string = '350px'
  @Input('width')
  public width: string = '100%'
  @Input('padding')
  public padding: string = '20px'
  @Input('iconSize')
  public iconSize: string = '150px'

  @Output()
  private fileUploaded: EventEmitter<File> = new EventEmitter<File>();
  @Output()
  private fileRemoved: EventEmitter<undefined> = new EventEmitter<undefined>();

  public fileUrl?: string;
  public uploadedFile?: File;

  public fileDragged: boolean = false;

  constructor(private utility: UtilityService) { }

  public onFileUpload(event: any): void {
    this.fileDragged = false;
    
    const file: File = event.target.files[0] as File;

    if (!this.allowedFileTypes.includes('*') && this.allowedFileTypes.indexOf(file?.type) === -1) {
      this.utility.message("پسوند پیوست اپلود شده مجاز نمیباشد", 'بستن')
      return;
    }

    this.fileUrl = URL.createObjectURL(file);
    this.uploadedFile = file;

    this.fileUploaded.emit(file);
  }

  public onRemoveUploadedFile(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.uploadedFile = undefined;
    this.fileUrl = undefined;

    this.fileRemoved.emit();
  }
}
