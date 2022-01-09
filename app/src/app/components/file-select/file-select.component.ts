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
  @Input() fileTypeLabel = 'photo';
  @Input() icon = 'add_a_photo';
  @Input() id = 'fileInput';
  @Input() multiple: boolean;
  @Input() progress: number;
  @Input() title: string;
  @Output() action: EventEmitter<File[]> = new EventEmitter<File[]>();

  public selectedFiles: File[] = [];

  public handleFileInput(event): void {
    this.selectedFiles = (event.target as any).files as File[];
  }

  public get shouldEnableActionButton(): boolean {
    return this.selectedFiles && this.selectedFiles.length !== 0 && this.progress === 0;
  }

  public performAction(): void {
    this.action.emit(this.selectedFiles);
  }
}
