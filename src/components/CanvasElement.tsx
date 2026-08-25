import React from 'react';
import { CardElement, StaffData, StudentData } from '../types';
import { resolveFieldValue } from '../utils/templateUtils';
import { generateBarcodeSvg } from '../utils/barcode';
import { generateQrCodeSvg } from '../utils/qrcode';

interface CanvasElementProps {
  element: CardElement;
  previewMode: boolean; // true = display mock dynamic data; false = display field template placeholder
  studentData: StudentData;
  staffData: StaffData;
  isSelected: boolean;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  previewMode,
  studentData,
  staffData,
  isSelected,
}) => {
  const { type, field, content, style, width, height } = element;

  // Resolve dynamic preview value if field is set
  const displayedValue = previewMode && field
    ? resolveFieldValue(field, studentData, staffData, content || '')
    : field
    ? `{${field}}`
    : content || '';

  const renderContent = () => {
    switch (type) {
      case 'text': {
        const isDynamic = Boolean(field);
        return (
          <div
            className="w-full h-full flex items-center overflow-hidden select-none"
            style={{
              fontFamily: style.fontFamily || 'Inter',
              fontSize: `${style.fontSize || 16}px`,
              fontWeight: style.fontWeight || 'normal',
              fontStyle: style.fontStyle || 'normal',
              textDecoration: style.textDecoration || 'none',
              textAlign: style.textAlign || 'left',
              justifyContent:
                style.textAlign === 'center'
                  ? 'center'
                  : style.textAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
              color: style.color || '#0f172a',
              letterSpacing: `${style.letterSpacing || 0}px`,
              lineHeight: style.lineHeight || 1.2,
              textTransform: style.textTransform || 'none',
              opacity: style.opacity ?? 1,
              backgroundColor: style.backgroundColor || 'transparent',
              borderRadius: `${style.borderRadius || 0}px`,
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: style.borderColor || 'transparent',
              borderStyle: style.borderStyle || 'solid',
              padding: style.backgroundColor && style.backgroundColor !== 'transparent' ? '4px 8px' : '0px',
            }}
          >
            <span
              className={`truncate w-full ${
                !previewMode && isDynamic
                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300 font-mono text-xs px-1.5 py-0.5 rounded shadow-xs'
                  : ''
              }`}
            >
              {displayedValue}
            </span>
          </div>
        );
      }

      case 'image': {
        const imageUrl = previewMode && field
          ? resolveFieldValue(field, studentData, staffData, content || '')
          : content || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

        const isDynamic = Boolean(field);

        return (
          <div
            className="w-full h-full overflow-hidden relative"
            style={{
              borderRadius: `${style.borderRadius || 0}px`,
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: style.borderColor || 'transparent',
              borderStyle: style.borderStyle || 'solid',
              backgroundColor: style.backgroundColor || '#f1f5f9',
              boxShadow: style.boxShadow,
              opacity: style.opacity ?? 1,
            }}
          >
            <img
              src={imageUrl}
              alt={element.name}
              className="w-full h-full pointer-events-none select-none"
              style={{
                objectFit: style.objectFit || 'cover',
              }}
              onError={(e) => {
                // Fallback for broken image link
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {!previewMode && isDynamic && (
              <div className="absolute top-1 left-1 bg-amber-500/95 text-white font-mono text-[10px] px-1.5 py-0.5 rounded shadow-xs">
                {field}
              </div>
            )}
          </div>
        );
      }

      case 'qr': {
        const qrValue = previewMode && field
          ? resolveFieldValue(field, studentData, staffData, content || 'https://macarte.edu')
          : content || 'https://macarte.edu';

        const qrSvg = generateQrCodeSvg(
          qrValue,
          style.qrFgColor || '#0f172a',
          style.qrBgColor || '#ffffff'
        );

        return (
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
            style={{
              borderRadius: `${style.borderRadius || 0}px`,
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: style.borderColor || 'transparent',
              borderStyle: style.borderStyle || 'solid',
              backgroundColor: style.backgroundColor || '#ffffff',
              opacity: style.opacity ?? 1,
            }}
          >
            <div
              className="w-full h-full p-1"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            {!previewMode && field && (
              <div className="absolute bottom-1 bg-amber-500/90 text-white font-mono text-[9px] px-1 py-0.5 rounded">
                QR: {field}
              </div>
            )}
          </div>
        );
      }

      case 'barcode': {
        const barcodeVal = previewMode && field
          ? resolveFieldValue(field, studentData, staffData, content || 'STU-2026')
          : content || 'STU-2026';

        const showText = style.barcodeShowText !== false;
        const barcodeSvg = generateBarcodeSvg(
          barcodeVal,
          showText,
          style.color || '#000000',
          style.backgroundColor || 'transparent'
        );

        return (
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
            style={{
              opacity: style.opacity ?? 1,
              borderRadius: `${style.borderRadius || 0}px`,
            }}
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: barcodeSvg }}
            />
            {!previewMode && field && (
              <div className="absolute top-0 right-1 bg-amber-500/90 text-white font-mono text-[9px] px-1 py-0.2 rounded">
                Barcode: {field}
              </div>
            )}
          </div>
        );
      }

      case 'rect': {
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: style.backgroundColor || '#e2e8f0',
              borderRadius: `${style.borderRadius || 0}px`,
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: style.borderColor || 'transparent',
              borderStyle: style.borderStyle || 'solid',
              opacity: style.opacity ?? 1,
              boxShadow: style.boxShadow,
            }}
          />
        );
      }

      case 'circle': {
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: style.backgroundColor || '#e2e8f0',
              borderRadius: '9999px',
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: style.borderColor || 'transparent',
              borderStyle: style.borderStyle || 'solid',
              opacity: style.opacity ?? 1,
              boxShadow: style.boxShadow,
            }}
          />
        );
      }

      case 'line': {
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: style.backgroundColor || '#0284c7',
              borderRadius: `${style.borderRadius || 1}px`,
              opacity: style.opacity ?? 1,
            }}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-full relative transition-[box-shadow] duration-75 ${
        isSelected ? 'ring-1 ring-blue-500 ring-offset-0' : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};
