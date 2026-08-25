import React from 'react';
import { CardType, StaffData, StudentData } from '../types';
import {
  ALTERNATIVE_STUDENT_PROFILES,
  ALTERNATIVE_STAFF_PROFILES,
} from '../constants/fields';
import { X, Sparkles, User, RefreshCw } from 'lucide-react';

interface DataPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: CardType;
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
  staffData: StaffData;
  setStaffData: (data: StaffData) => void;
}

export const DataPreviewDrawer: React.FC<DataPreviewDrawerProps> = ({
  isOpen,
  onClose,
  cardType,
  studentData,
  setStudentData,
  staffData,
  setStaffData,
}) => {
  if (!isOpen) return null;

  const isStudent = cardType === 'student';

  return (
    <div
      id="drawer_data_preview"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-5 text-slate-200 shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Preview Test Persona</h3>
              <p className="text-xs text-slate-400">
                Mock data injected into dynamic <code className="font-mono text-blue-300">{cardType}.*</code> fields
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Persona Switcher Buttons */}
        <div className="py-3 border-b border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Sample Profiles
          </div>
          <div className="flex gap-2">
            {(isStudent ? ALTERNATIVE_STUDENT_PROFILES : ALTERNATIVE_STAFF_PROFILES).map((profile, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isStudent) setStudentData(profile as StudentData);
                  else setStaffData(profile as StaffData);
                }}
                className="flex-1 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-750 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-white truncate">
                  {profile.first_name} {profile.last_name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isStudent ? (profile as StudentData).student_number : (profile as StaffData).function}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editable Form Inputs for Live Testing */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Edit Preview Attributes
          </div>

          {isStudent ? (
            <>
              <div>
                <label className="text-[10px] text-slate-400">First Name (student.first_name)</label>
                <input
                  type="text"
                  value={studentData.first_name}
                  onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Last Name (student.last_name)</label>
                <input
                  type="text"
                  value={studentData.last_name}
                  onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Student Number (student.student_number)</label>
                <input
                  type="text"
                  value={studentData.student_number}
                  onChange={(e) => setStudentData({ ...studentData, student_number: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Class / Grade (student.class_id)</label>
                <input
                  type="text"
                  value={studentData.class_name || studentData.class_id}
                  onChange={(e) => setStudentData({ ...studentData, class_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Birth Date (student.birth_date)</label>
                <input
                  type="text"
                  value={studentData.birth_date}
                  onChange={(e) => setStudentData({ ...studentData, birth_date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Student Photo URL (student.photo_url)</label>
                <input
                  type="text"
                  value={studentData.photo_url}
                  onChange={(e) => setStudentData({ ...studentData, photo_url: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded font-mono truncate"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Guardian Phone (student.guardian_phone)</label>
                <input
                  type="text"
                  value={studentData.guardian_phone}
                  onChange={(e) => setStudentData({ ...studentData, guardian_phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded font-mono"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[10px] text-slate-400">First Name (staff.first_name)</label>
                <input
                  type="text"
                  value={staffData.first_name}
                  onChange={(e) => setStaffData({ ...staffData, first_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Last Name (staff.last_name)</label>
                <input
                  type="text"
                  value={staffData.last_name}
                  onChange={(e) => setStaffData({ ...staffData, last_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Function / Role (staff.function)</label>
                <input
                  type="text"
                  value={staffData.function}
                  onChange={(e) => setStaffData({ ...staffData, function: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Phone (staff.phone)</label>
                <input
                  type="text"
                  value={staffData.phone}
                  onChange={(e) => setStaffData({ ...staffData, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Staff Photo URL (staff.photo_url)</label>
                <input
                  type="text"
                  value={staffData.photo_url}
                  onChange={(e) => setStaffData({ ...staffData, photo_url: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 rounded font-mono truncate"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
