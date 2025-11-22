'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Download, Printer, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  description?: string;
  size?: number;
  showDownload?: boolean;
  showPrint?: boolean;
  variant?: 'button' | 'icon';
}

export function QRCodeDisplay({
  value,
  title = 'QR Code',
  description = 'Scan this code to access details',
  size = 256,
  showDownload = true,
  showPrint = true,
  variant = 'button',
}: QRCodeDisplayProps) {
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${value.slice(0, 20)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${title}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: sans-serif;
            }
            .qr-container {
              text-align: center;
              page-break-inside: avoid;
            }
            h2 {
              margin: 10px 0;
              font-size: 18px;
            }
            p {
              margin: 5px 0 15px 0;
              color: #666;
              font-size: 14px;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>${title}</h2>
            <p>${description}</p>
            ${svgData}
            <p style="margin-top: 15px; font-size: 12px; color: #999;">${value}</p>
          </div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const TriggerButton = variant === 'button' ? (
    <Button variant="outline" size="sm">
      <QrCode className="mr-2 h-4 w-4" />
      QR Code
    </Button>
  ) : (
    <Button variant="ghost" size="icon" className="text-white hover:text-cyan-400 hover:bg-slate-800">
      <QrCode className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Card className="p-4 bg-white">
            <QRCode
              id="qr-code-svg"
              value={value}
              size={size}
              level="H"
            />
          </Card>
          <p className="text-xs text-muted-foreground text-center break-all px-4">
            {value}
          </p>
          <div className="flex gap-2 w-full">
            {showDownload && (
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            )}
            {showPrint && (
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print Label
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
