import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-insert-image-dialog',
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './insert-image-dialog.component.html',
  styleUrl: './insert-image-dialog.component.scss'
})
export class InsertImageDialogComponent {

  imageUrl: string = '';
  selectedFile?: File;

  constructor(private dialogRef: MatDialogRef<InsertImageDialogComponent>) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  insertImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.dialogRef.close(reader.result as string); // Devuelve la imagen como base64
      };
      reader.readAsDataURL(this.selectedFile);
    } else if (this.imageUrl) {
      this.dialogRef.close(this.imageUrl); // Devuelve la URL directamente
    } else {
      this.dialogRef.close(null);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
