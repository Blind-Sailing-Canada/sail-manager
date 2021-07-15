import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.css']
})
export class FileSelectComponent {

  @Input() actionDescription: string;
  @Input() actionName: string;
  @Input() fileFilter: string;
  @Input() multiple: boolean;
  @Input() progress: number;
  @Input() title: string;
  @Input() id = 'fileInput';
  @Output() action: EventEmitter<File[]> = new EventEmitter<File[]>();

  public selectedFiles: File[] = [];

  public handleFileInput(files: File[]): void {
    this.selectedFiles = files;
  }

  public get shouldEnableActionButton(): boolean {
    return this.selectedFiles && this.selectedFiles.length !== 0 && this.progress === 0;
  }

  protected performAction(): void {
    this.action.emit(this.selectedFiles);
  }
}
