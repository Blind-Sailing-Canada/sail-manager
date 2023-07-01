import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss']
})
export class FileSelectComponent implements OnChanges {

  @Input() actionDescription: string;
  @Input() actionName: string;
  @Input() fileFilter: string;
  @Input() fileTypeLabel = 'photo';
  @Input() icon = 'add_a_photo';
  @Input() id = 'fileInput';
  @Input() maxFileSizeBytes = 100 * 1024 * 1024; // 100 MB
  @Input() multiple: boolean;
  @Input() progress = 0;
  @Input() title: string;
  @Output() action: EventEmitter<File[]> = new EventEmitter<File[]>();

  public selectedFiles: File[] = [];
  public selectedFileErrorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.progress) {
      if (changes.progress.currentValue === -1) {
        this.selectedFiles = [];
        this.selectedFileErrorMessage = '';
      }
    }
  }

  public handleFileInput(event): void {
    this.selectedFiles = (event.target as any).files as File[];

    const errorMessages = [];

    for(const file of this.selectedFiles) {
      if (file.size > this.maxFileSizeBytes) {
        errorMessages.push(`Selected file ${file.name} exceeds file size limit.`);
      }
    };

    this.selectedFileErrorMessage = errorMessages.join(' ');
  }

  public get shouldEnableActionButton(): boolean {
    if (this.selectedFileErrorMessage) return false;
    if (!this.selectedFiles) return false;
    if (!this.selectedFiles.length) return false;
    if (this.progress > 0 && this.progress < 100) return false;

    return true;
  }

  public performAction(): void {
    this.action.emit(this.selectedFiles);
  }
}
