import { CardElement, CardTemplate, DynamicFieldDef, ElementType, StaffData, StudentData } from '../types';

/**
 * Resolves dynamic field key into actual human readable string or image URL
 * using preview student or staff data.
 */
export function resolveFieldValue(
  fieldKey: string | null | undefined,
  studentData: StudentData,
  staffData: StaffData,
  fallbackContent: string = ''
): string {
  if (!fieldKey) return fallbackContent;

  const [entity, prop] = fieldKey.split('.');

  if (entity === 'student') {
    switch (prop) {
      case 'full_name':
        return [studentData.first_name, studentData.middle_name, studentData.last_name]
          .filter(Boolean)
          .join(' ');
      case 'first_name':
        return studentData.first_name || '';
      case 'last_name':
        return studentData.last_name || '';
      case 'middle_name':
        return studentData.middle_name || '';
      case 'gender':
        return studentData.gender || '';
      case 'birth_date':
        return studentData.birth_date || '';
      case 'birth_place':
        return studentData.birth_place || '';
      case 'address':
        return studentData.address || '';
      case 'guardian_name':
        return studentData.guardian_name || '';
      case 'guardian_phone':
        return studentData.guardian_phone || '';
      case 'student_number':
        return studentData.student_number || '';
      case 'photo_url':
        return studentData.photo_url || '';
      case 'class_id':
      case 'class_name':
        return studentData.class_name || studentData.class_id || '';
      case 'id':
        return String(studentData.id || '');
      case 'school_id':
        return String(studentData.school_id || '');
      default:
        return fallbackContent || fieldKey;
    }
  }

  if (entity === 'staff') {
    switch (prop) {
      case 'full_name':
        return [staffData.first_name, staffData.middle_name, staffData.last_name]
          .filter(Boolean)
          .join(' ');
      case 'first_name':
        return staffData.first_name || '';
      case 'last_name':
        return staffData.last_name || '';
      case 'middle_name':
        return staffData.middle_name || '';
      case 'gender':
        return staffData.gender || '';
      case 'marital_status':
        return staffData.marital_status || '';
      case 'number_of_children':
        return String(staffData.number_of_children ?? '');
      case 'function':
        return staffData.function || '';
      case 'phone':
        return staffData.phone || '';
      case 'address':
        return staffData.address || '';
      case 'photo_url':
        return staffData.photo_url || '';
      case 'id':
        return String(staffData.id || '');
      case 'school_id':
        return String(staffData.school_id || '');
      default:
        return fallbackContent || fieldKey;
    }
  }

  return fallbackContent || fieldKey;
}

let elementCounter = 100;

export function generateElementId(): string {
  elementCounter += 1;
  return `elem_${Date.now()}_${elementCounter}`;
}

/**
 * Creates a new CardElement from a dynamic field definition
 */
export function createElementFromField(fieldDef: DynamicFieldDef, initialX = 200, initialY = 200): CardElement {
  const isImage = fieldDef.defaultType === 'image';
  
  return {
    id: generateElementId(),
    name: fieldDef.label,
    type: fieldDef.defaultType,
    field: fieldDef.key,
    content: fieldDef.placeholder,
    x: initialX,
    y: initialY,
    width: fieldDef.defaultWidth,
    height: fieldDef.defaultHeight,
    rotation: 0,
    zIndex: 10,
    locked: false,
    hidden: false,
    style: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 600,
      color: '#0f172a',
      textAlign: 'left',
      ...fieldDef.defaultStyle,
      ...(isImage ? { objectFit: 'cover' } : {}),
    },
  };
}

/**
 * Creates generic elements (Text, Image, Rect, Circle, Line, QR, Barcode)
 */
export function createGenericElement(type: ElementType, cardType: 'student' | 'staff', initialX = 220, initialY = 220): CardElement {
  const id = generateElementId();

  switch (type) {
    case 'text':
      return {
        id,
        name: 'Static Text',
        type: 'text',
        content: 'Edit Heading Text',
        x: initialX,
        y: initialY,
        width: 260,
        height: 36,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: 700,
          color: '#0f172a',
          textAlign: 'left',
        },
      };

    case 'image':
      return {
        id,
        name: 'Generic Image',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=300',
        x: initialX,
        y: initialY,
        width: 140,
        height: 140,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          borderRadius: 8,
          objectFit: 'contain',
        },
      };

    case 'qr':
      return {
        id,
        name: 'QR Code',
        type: 'qr',
        field: cardType === 'student' ? 'student.student_number' : 'staff.phone',
        content: cardType === 'student' ? 'STU-2026-001' : '+257 79 111 111',
        x: initialX,
        y: initialY,
        width: 110,
        height: 110,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e2e8f0',
        },
      };

    case 'barcode':
      return {
        id,
        name: 'Barcode',
        type: 'barcode',
        field: cardType === 'student' ? 'student.student_number' : 'staff.phone',
        content: cardType === 'student' ? 'STU-2026-001' : '+257 79 111 111',
        x: initialX,
        y: initialY,
        width: 280,
        height: 70,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          barcodeShowText: true,
        },
      };

    case 'rect':
      return {
        id,
        name: 'Rectangle Box',
        type: 'rect',
        x: initialX,
        y: initialY,
        width: 200,
        height: 100,
        rotation: 0,
        zIndex: 5,
        locked: false,
        hidden: false,
        style: {
          backgroundColor: '#e0f2fe',
          borderColor: '#0284c7',
          borderWidth: 1,
          borderRadius: 8,
        },
      };

    case 'circle':
      return {
        id,
        name: 'Circle / Badge',
        type: 'circle',
        x: initialX,
        y: initialY,
        width: 120,
        height: 120,
        rotation: 0,
        zIndex: 5,
        locked: false,
        hidden: false,
        style: {
          backgroundColor: '#f1f5f9',
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderRadius: 9999,
        },
      };

    case 'line':
      return {
        id,
        name: 'Divider Line',
        type: 'line',
        x: initialX,
        y: initialY,
        width: 320,
        height: 3,
        rotation: 0,
        zIndex: 5,
        locked: false,
        hidden: false,
        style: {
          backgroundColor: '#0284c7',
        },
      };
  }
}

/**
 * Creates school branding elements
 */
export function createSchoolBrandingElement(
  brandType: 'logo' | 'stamp' | 'signature' | 'motto' | 'name' | 'badge',
  initialX = 200,
  initialY = 150
): CardElement {
  const id = generateElementId();

  switch (brandType) {
    case 'logo':
      return {
        id,
        name: 'School Logo',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
        x: initialX,
        y: initialY,
        width: 80,
        height: 80,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          borderRadius: 40,
          backgroundColor: '#ffffff',
          borderColor: '#0284c7',
          borderWidth: 2,
          objectFit: 'contain',
        },
      };

    case 'stamp':
      return {
        id,
        name: 'Official School Stamp',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
        x: initialX,
        y: initialY,
        width: 90,
        height: 90,
        rotation: -10,
        zIndex: 15,
        locked: false,
        hidden: false,
        style: {
          objectFit: 'contain',
          opacity: 0.8,
        },
      };

    case 'signature':
      return {
        id,
        name: 'Principal Signature',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200',
        x: initialX,
        y: initialY,
        width: 140,
        height: 55,
        rotation: 0,
        zIndex: 12,
        locked: false,
        hidden: false,
        style: {
          objectFit: 'contain',
          opacity: 0.9,
        },
      };

    case 'motto':
      return {
        id,
        name: 'School Motto',
        type: 'text',
        content: 'EXCELLENCE • DISCIPLINE • SUCCESS',
        x: initialX,
        y: initialY,
        width: 320,
        height: 24,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: 2,
          textAlign: 'center',
        },
      };

    case 'name':
      return {
        id,
        name: 'School Title Header',
        type: 'text',
        content: 'INTERNATIONAL ACADEMY OF EXCELLENCE',
        x: initialX,
        y: initialY,
        width: 480,
        height: 36,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          fontFamily: 'Inter',
          fontSize: 19,
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: 1,
        },
      };

    case 'badge':
      return {
        id,
        name: 'Official Badge Tag',
        type: 'text',
        content: 'OFFICIAL STUDENT PASS',
        x: initialX,
        y: initialY,
        width: 180,
        height: 26,
        rotation: 0,
        zIndex: 10,
        locked: false,
        hidden: false,
        style: {
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: 700,
          color: '#ffffff',
          backgroundColor: '#0284c7',
          borderRadius: 4,
          textAlign: 'center',
        },
      };
  }
}

/**
 * Deep clone helper for template immutability & undo/redo
 */
export function cloneTemplate(template: CardTemplate): CardTemplate {
  return JSON.parse(JSON.stringify(template));
}

/**
 * Validate imported JSON template
 */
export function validateTemplateJson(jsonString: string): { valid: boolean; template?: CardTemplate; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'JSON must be a valid object' };
    }
    if (!Array.isArray(parsed.elements)) {
      return { valid: false, error: 'Template must contain an "elements" array' };
    }
    if (!parsed.width || !parsed.height) {
      return { valid: false, error: 'Template must specify width and height' };
    }
    const template: CardTemplate = {
      version: parsed.version || 1,
      type: parsed.type === 'staff' ? 'staff' : 'student',
      name: parsed.name || 'Untitled Template',
      width: Number(parsed.width) || 856,
      height: Number(parsed.height) || 540,
      unit: parsed.unit || 'px',
      orientation: parsed.orientation || (parsed.height > parsed.width ? 'portrait' : 'landscape'),
      background: parsed.background || { type: 'color', value: '#ffffff' },
      elements: parsed.elements.map((el: Partial<CardElement>, idx: number) => ({
        id: el.id || `elem_import_${idx}`,
        name: el.name || `Element ${idx + 1}`,
        type: el.type || 'text',
        field: el.field || null,
        content: el.content || '',
        x: Number(el.x) || 0,
        y: Number(el.y) || 0,
        width: Number(el.width) || 100,
        height: Number(el.height) || 40,
        rotation: Number(el.rotation) || 0,
        zIndex: Number(el.zIndex) || idx + 1,
        locked: Boolean(el.locked),
        hidden: Boolean(el.hidden),
        style: el.style || {},
      })),
    };
    return { valid: true, template };
  } catch (err: unknown) {
    return { valid: false, error: (err as Error).message || 'Invalid JSON format' };
  }
}
