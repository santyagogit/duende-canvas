import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintConfig } from '../../models/print-config';

@Component({
  selector: 'app-print-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatLabel, MatSelect, MatOption, FormsModule, CommonModule],
  templateUrl: './print-dialog.component.html',
  styleUrl: './print-dialog.component.scss'
})
export class PrintDialogComponent {
  config: PrintConfig;

  constructor(
    private dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrintConfig
  ) {
    this.config = { ...data }; // Clonar la configuración inicial
  }

  onCancelar() {
    this.dialogRef.close();
  }

  onVistaPrevia() {
    this.dialogRef.close({ action: 'preview', config: this.config });
  }

  onImprimir() {
    this.dialogRef.close({ action: 'print', config: this.config });
  }
}
