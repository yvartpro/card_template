/**
 * Type definitions for macarte Card Template Editor
 */

export type CardType = 'student' | 'staff';

export type ElementType =
  | 'text'
  | 'image'
  | 'qr'
  | 'barcode'
  | 'rect'
  | 'circle'
  | 'line';

export type CardUnit = 'px' | 'mm';

export type CardOrientation = 'landscape' | 'portrait';

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  value: string; // Hex color or image URL
  gradient?: {
    type: 'linear' | 'radial';
    from: string;
    to: string;
    angle?: number;
  };
  opacity?: number;
}

export interface ElementStyle {
  // Typography
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Box / Appearance
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
  opacity?: number;
  boxShadow?: string;

  // Image specific
  objectFit?: 'cover' | 'contain' | 'fill';

  // QR / Barcode specific
  barcodeShowText?: boolean;
  qrFgColor?: string;
  qrBgColor?: string;
}

export interface CardElement {
  id: string;
  name: string;
  type: ElementType;
  field?: string | null; // e.g. "student.full_name", "student.photo_url", "staff.function"
  content?: string; // Static text content, image URL, or default placeholder text
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;
  style: ElementStyle;
}

export interface CardTemplate {
  version: number;
  type: CardType;
  name: string;
  width: number;
  height: number;
  unit: CardUnit;
  orientation: CardOrientation;
  background: BackgroundConfig;
  elements: CardElement[];
}

export interface DynamicFieldDef {
  key: string; // e.g. "student.full_name"
  label: string; // e.g. "Full Name"
  category: 'identity' | 'academic' | 'personal' | 'contact' | 'staff_info';
  cardType: CardType;
  defaultType: ElementType;
  defaultWidth: number;
  defaultHeight: number;
  placeholder: string;
  iconName: string;
  defaultStyle?: Partial<ElementStyle>;
}

export interface StudentData {
  id: number | string;
  school_id: number | string;
  class_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  birth_date: string;
  birth_place: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  student_number: string;
  photo_url: string;
  class_name?: string;
  academic_year?: string;
  school_name?: string;
}

export interface StaffData {
  id: number | string;
  school_id: number | string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  marital_status: string;
  number_of_children: number;
  function: string;
  phone: string;
  address: string;
  photo_url: string;
  department?: string;
  employee_id?: string;
  school_name?: string;
}

export interface CardPreset {
  id: string;
  name: string;
  type: CardType;
  category: string;
  description: string;
  previewThumbnail?: string;
  template: CardTemplate;
}

export interface DimensionPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}
