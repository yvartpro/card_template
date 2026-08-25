import React, { useState } from 'react';
import {
  CardElement,
  CardTemplate,
  DynamicFieldDef,
  ElementType,
} from '../types';
import {
  DYNAMIC_STUDENT_FIELDS,
  DYNAMIC_STAFF_FIELDS,
} from '../constants/fields';
import {
  createElementFromField,
  createGenericElement,
  createSchoolBrandingElement,
} from '../utils/templateUtils';
import {
  User,
  Hash,
  GraduationCap,
  Calendar,
  MapPin,
  Home,
  Phone,
  Shield,
  Briefcase,
  Heart,
  Users,
  Camera,
  QrCode,
  Barcode,
  Type,
  Square,
  Circle,
  Minus,
  Sparkles,
  Layers,
  Stamp,
  Award,
  PenTool,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
} from 'lucide-react';

interface LeftSidebarProps {
  template: CardTemplate;
  addElement: (element: CardElement) => void;
  selectedIds: string[];
  selectElement: (id: string, multiSelect?: boolean) => void;
  toggleLock: (id: string) => void;
  toggleHide: (id: string) => void;
  deleteElement: (id: string) => void;
  bringForward: () => void;
  sendBackward: () => void;
}

type TabType = 'fields' | 'shapes' | 'branding' | 'layers';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  template,
  addElement,
  selectedIds,
  selectElement,
  toggleLock,
  toggleHide,
  deleteElement,
  bringForward,
  sendBackward,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('fields');
  const [searchQuery, setSearchQuery] = useState('');

  const currentFields: DynamicFieldDef[] =
    template.type === 'student' ? DYNAMIC_STUDENT_FIELDS : DYNAMIC_STAFF_FIELDS;

  const filteredFields = currentFields.filter(
    (f) =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
      case 'UserCheck':
        return <User className="w-4 h-4" />;
      case 'Hash':
        return <Hash className="w-4 h-4" />;
      case 'Camera':
        return <Camera className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'Heart':
        return <Heart className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getElementTypeIcon = (type: ElementType) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-blue-400" />;
      case 'image':
        return <Camera className="w-3.5 h-3.5 text-emerald-400" />;
      case 'qr':
        return <QrCode className="w-3.5 h-3.5 text-indigo-400" />;
      case 'barcode':
        return <Barcode className="w-3.5 h-3.5 text-amber-400" />;
      case 'rect':
        return <Square className="w-3.5 h-3.5 text-purple-400" />;
      case 'circle':
        return <Circle className="w-3.5 h-3.5 text-pink-400" />;
      case 'line':
        return <Minus className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const handleAddField = (fieldDef: DynamicFieldDef) => {
    const el = createElementFromField(fieldDef, 240, 180);
    addElement(el);
  };

  const handleAddGeneric = (type: ElementType) => {
    const el = createGenericElement(type, template.type, 240, 180);
    addElement(el);
  };

  const handleAddBranding = (brandType: 'logo' | 'stamp' | 'signature' | 'motto' | 'name' | 'badge') => {
    const el = createSchoolBrandingElement(brandType, 240, 180);
    addElement(el);
  };

  return (
    <aside
      id="left_sidebar_panel"
      className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none shrink-0"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
        <button
          id="tab_dynamic_fields"
          onClick={() => setActiveTab('fields')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold rounded-md flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'fields'
              ? 'bg-slate-800 text-blue-400 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="truncate">Fields</span>
        </button>

        <button
          id="tab_general_shapes"
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold rounded-md flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'shapes'
              ? 'bg-slate-800 text-blue-400 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Square className="w-4 h-4" />
          <span className="truncate">Elements</span>
        </button>

        <button
          id="tab_school_branding"
          onClick={() => setActiveTab('branding')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold rounded-md flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'branding'
              ? 'bg-slate-800 text-blue-400 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="truncate">Branding</span>
        </button>

        <button
          id="tab_layers_tree"
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2 px-1 text-center text-xs font-semibold rounded-md flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'layers'
              ? 'bg-slate-800 text-blue-400 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="truncate">Layers ({template.elements.length})</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: DYNAMIC FIELDS */}
        {activeTab === 'fields' && (
          <div className="space-y-3">
            {/* Header info */}
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 text-xs">
              <div className="font-semibold text-slate-200 flex items-center justify-between">
                <span className="capitalize">{template.type} Dynamic Fields</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {template.type}.*
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1">
                Click any field to add it to the canvas. In the template, it stores the path (e.g.{' '}
                <code className="text-blue-300 font-mono">"{template.type}.full_name"</code>).
              </p>
            </div>

            {/* Field Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${template.type} fields...`}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 pl-8 pr-3 py-1.5 rounded-md text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Field List Grid */}
            <div className="space-y-1.5">
              {filteredFields.map((field) => (
                <button
                  key={field.key}
                  id={`btn_add_field_${field.key.replace('.', '_')}`}
                  onClick={() => handleAddField(field)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-slate-700/70 text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      {getFieldIcon(field.iconName)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                        {field.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {field.key}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL ELEMENTS & SHAPES */}
        {activeTab === 'shapes' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Generic Components
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn_add_text"
                onClick={() => handleAddGeneric('text')}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-2 text-center group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Text Box</div>
                  <div className="text-[10px] text-slate-400">Static Label</div>
                </div>
              </button>

              <button
                id="btn_add_image"
                onClick={() => handleAddGeneric('image')}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-2 text-center group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Image / Photo</div>
                  <div className="text-[10px] text-slate-400">Custom URL</div>
                </div>
              </button>

              <button
                id="btn_add_qr"
                onClick={() => handleAddGeneric('qr')}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-2 text-center group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">QR Code</div>
                  <div className="text-[10px] text-slate-400">Dynamic/URL</div>
                </div>
              </button>

              <button
                id="btn_add_barcode"
                onClick={() => handleAddGeneric('barcode')}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-2 text-center group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Barcode</div>
                  <div className="text-[10px] text-slate-400">Code128 / ID</div>
                </div>
              </button>
            </div>

            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider pt-2">
              Shapes & Accents
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn_add_rect"
                onClick={() => handleAddGeneric('rect')}
                className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-1 text-center group transition-all"
              >
                <Square className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                <span className="text-[11px] font-medium text-slate-300">Rectangle</span>
              </button>

              <button
                id="btn_add_circle"
                onClick={() => handleAddGeneric('circle')}
                className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-1 text-center group transition-all"
              >
                <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                <span className="text-[11px] font-medium text-slate-300">Circle</span>
              </button>

              <button
                id="btn_add_line"
                onClick={() => handleAddGeneric('line')}
                className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500/60 flex flex-col items-center gap-1 text-center group transition-all"
              >
                <Minus className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                <span className="text-[11px] font-medium text-slate-300">Line</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SCHOOL BRANDING */}
        {activeTab === 'branding' && (
          <div className="space-y-3">
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 text-xs">
              <div className="font-semibold text-slate-200">Static School Branding</div>
              <p className="text-slate-400 text-[11px] mt-1">
                Insert institution identity placeholders (logo, stamps, authorized signature, motto) ready to design with.
              </p>
            </div>

            <div className="space-y-2">
              <button
                id="btn_brand_logo"
                onClick={() => handleAddBranding('logo')}
                className="w-full p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">School Logo</div>
                    <div className="text-[10px] text-slate-400">Emblem / Crest Badge</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </button>

              <button
                id="btn_brand_name"
                onClick={() => handleAddBranding('name')}
                className="w-full p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">School Title Header</div>
                    <div className="text-[10px] text-slate-400">Institution Name Banner</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              <button
                id="btn_brand_stamp"
                onClick={() => handleAddBranding('stamp')}
                className="w-full p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Stamp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Official Stamp</div>
                    <div className="text-[10px] text-slate-400">Circular Seal Watermark</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
              </button>

              <button
                id="btn_brand_signature"
                onClick={() => handleAddBranding('signature')}
                className="w-full p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Principal Signature</div>
                    <div className="text-[10px] text-slate-400">Signoff Verification</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                id="btn_brand_motto"
                onClick={() => handleAddBranding('motto')}
                className="w-full p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-750 hover:border-blue-500 flex items-center justify-between text-left group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">School Motto</div>
                    <div className="text-[10px] text-slate-400">Values & Slogan</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: LAYERS TREE */}
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Layers Order (Top to Bottom)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={bringForward}
                  title="Move Selected Layer Up"
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={sendBackward}
                  title="Move Selected Layer Down"
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {template.elements.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No elements on canvas.
              </div>
            ) : (
              <div className="space-y-1">
                {[...template.elements].reverse().map((el) => {
                  const isSelected = selectedIds.includes(el.id);

                  return (
                    <div
                      key={el.id}
                      onClick={() => selectElement(el.id, false)}
                      className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {getElementTypeIcon(el.type)}
                        <div className="truncate">
                          <div className="font-medium truncate">{el.name}</div>
                          {el.field && (
                            <div className="text-[10px] text-amber-400/90 font-mono truncate">
                              {el.field}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action icons: Lock, Hide, Delete */}
                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => toggleLock(el.id)}
                          title={el.locked ? 'Unlock element' : 'Lock element'}
                          className={`p-1 rounded hover:bg-slate-700 ${
                            el.locked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => toggleHide(el.id)}
                          title={el.hidden ? 'Show element' : 'Hide element'}
                          className={`p-1 rounded hover:bg-slate-700 ${
                            el.hidden ? 'text-slate-600' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {el.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => deleteElement(el.id)}
                          title="Delete Element"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
