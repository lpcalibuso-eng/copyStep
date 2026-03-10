import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Shield,
  Check,
  AlertCircle,
  RotateCcw,
  Save,
  Lock,
  Users,
  Search,
  UserPlus,
  CheckCircle,
  Repeat,
} from 'lucide-react';

function showToast(message, type = 'success') {
  const id = `simple-toast-${Date.now()}`;
  const el = document.createElement('div');
  el.id = id;
  el.className = 'fixed right-4 bottom-6 z-50 px-4 py-2 rounded shadow text-white';
  el.style.background = type === 'success' ? '#0ea5e9' : '#ef4444';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    const e = document.getElementById(id);
    if (e) e.remove();
  }, 2200);
}

function Modal({ open, onClose, title, description, children }) {
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="overflow-y-auto p-6 pt-0">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function Switch({ checked, onCheckedChange, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-blue-600' : 'bg-gray-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      aria-pressed={checked}
      aria-disabled={disabled}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}

function Badge({ children, className = '' }) {
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className].join(' ')}>
      {children}
    </span>
  );
}

function Select({ value, onValueChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={['w-full px-3 py-2 border border-gray-200 rounded-xl bg-white', className].join(' ')}
    >
      {children}
    </select>
  );
}

function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

function Avatar({ children, className = '' }) {
  return <div className={['inline-flex items-center justify-center rounded-full overflow-hidden', className].join(' ')}>{children}</div>;
}

function AvatarFallback({ className = '', children, name }) {
  const initials = (children || (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join(''));

  return (
    <div className={['w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-medium', className].join(' ')}>
      {initials || '?'}
    </div>
  );
}

export function RolePermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('CSG Officer');
  const [selectedCSGPosition, setSelectedCSGPosition] = useState('president');
  const [activeDelegation, setActiveDelegation] = useState({
    to: 'John Doe',
    until: 'March 15, 2026',
  });

  const [isSetOfficerModalOpen, setIsSetOfficerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const mockUsers = [
    { id: '1', name: 'Maria Santos', email: 'maria.santos@kld.edu', studentId: '2021-00123', avatar: 'MS', currentRole: 'Student' },
    { id: '2', name: 'Carlos De Leon', email: 'carlos.delon@kld.edu', studentId: '2021-00456', avatar: 'CD', currentRole: 'CSG Officer' },
    { id: '3', name: 'Ana Martinez', email: 'ana.martinez@kld.edu', studentId: '2021-00789', avatar: 'AM', currentRole: 'Student' },
    { id: '4', name: 'John Reyes', email: 'john.reyes@kld.edu', studentId: '2021-00234', avatar: 'JR', currentRole: 'CSG Officer' },
    { id: '5', name: 'Sofia Garcia', email: 'sofia.garcia@kld.edu', studentId: '2021-00567', avatar: 'SG', currentRole: 'Student' },
    { id: '6', name: 'Miguel Torres', email: 'miguel.torres@kld.edu', studentId: '2021-00890', avatar: 'MT', currentRole: 'Student' },
    { id: '7', name: 'Isabel Cruz', email: 'isabel.cruz@kld.edu', studentId: '2021-00345', avatar: 'IC', currentRole: 'Student' },
    { id: '8', name: 'Rafael Mendoza', email: 'rafael.mendoza@kld.edu', studentId: '2021-00678', avatar: 'RM', currentRole: 'Student' },
  ];

  const [councilOfficers, setCouncilOfficers] = useState([
    { position: 'president', name: 'John Reyes', userId: '4', email: 'john.reyes@kld.edu' },
    { position: 'vp-internal', name: 'Maria Santos', userId: '1', email: 'maria.santos@kld.edu' },
    { position: 'treasurer', name: 'Carlos De Leon', userId: '2', email: 'carlos.delon@kld.edu' },
    { position: 'secretary', name: 'Ana Martinez', userId: '3', email: 'ana.martinez@kld.edu' },
    { position: 'auditor', name: '', userId: '', email: '' },
  ]);

  const [csgPositions, setCSGPositions] = useState([
    {
      id: 'president',
      name: 'President',
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_create', label: 'Create', enabled: true },
            { id: 'proj_edit', label: 'Edit', enabled: true },
            { id: 'proj_delete', label: 'Delete', enabled: true },
            { id: 'proj_approve', label: 'Approve', enabled: false },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_create', label: 'Create', enabled: true },
            { id: 'ledger_edit', label: 'Edit', enabled: true },
            { id: 'ledger_delete', label: 'Delete', enabled: true },
            { id: 'ledger_approve', label: 'Approve', enabled: false },
            { id: 'ledger_submit', label: 'Submit', enabled: true },
          ],
        },
        {
          category: 'Proof',
          permissions: [
            { id: 'proof_view', label: 'View', enabled: true },
            { id: 'proof_upload', label: 'Upload', enabled: true },
            { id: 'proof_delete', label: 'Delete', enabled: true },
            { id: 'proof_verify', label: 'Verify', enabled: false },
          ],
        },
      ],
    },
    {
      id: 'vp-internal',
      name: 'Vice President - Internal',
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_create', label: 'Create', enabled: true },
            { id: 'proj_edit', label: 'Edit', enabled: true },
            { id: 'proj_delete', label: 'Delete', enabled: false },
            { id: 'proj_approve', label: 'Approve', enabled: false },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_create', label: 'Create', enabled: true },
            { id: 'ledger_edit', label: 'Edit', enabled: true },
            { id: 'ledger_delete', label: 'Delete', enabled: false },
            { id: 'ledger_approve', label: 'Approve', enabled: false },
            { id: 'ledger_submit', label: 'Submit', enabled: true },
          ],
        },
        {
          category: 'Proof',
          permissions: [
            { id: 'proof_view', label: 'View', enabled: true },
            { id: 'proof_upload', label: 'Upload', enabled: true },
            { id: 'proof_delete', label: 'Delete', enabled: false },
            { id: 'proof_verify', label: 'Verify', enabled: false },
          ],
        },
      ],
    },
    {
      id: 'treasurer',
      name: 'Treasurer',
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_create', label: 'Create', enabled: false },
            { id: 'proj_edit', label: 'Edit', enabled: false },
            { id: 'proj_delete', label: 'Delete', enabled: false },
            { id: 'proj_approve', label: 'Approve', enabled: false },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_create', label: 'Create', enabled: true },
            { id: 'ledger_edit', label: 'Edit', enabled: true },
            { id: 'ledger_delete', label: 'Delete', enabled: true },
            { id: 'ledger_approve', label: 'Approve', enabled: false },
            { id: 'ledger_submit', label: 'Submit', enabled: true },
          ],
        },
        {
          category: 'Proof',
          permissions: [
            { id: 'proof_view', label: 'View', enabled: true },
            { id: 'proof_upload', label: 'Upload', enabled: true },
            { id: 'proof_delete', label: 'Delete', enabled: true },
            { id: 'proof_verify', label: 'Verify', enabled: false },
          ],
        },
      ],
    },
    {
      id: 'secretary',
      name: 'Secretary',
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_create', label: 'Create', enabled: true },
            { id: 'proj_edit', label: 'Edit', enabled: true },
            { id: 'proj_delete', label: 'Delete', enabled: false },
            { id: 'proj_approve', label: 'Approve', enabled: false },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_create', label: 'Create', enabled: false },
            { id: 'ledger_edit', label: 'Edit', enabled: false },
            { id: 'ledger_delete', label: 'Delete', enabled: false },
            { id: 'ledger_approve', label: 'Approve', enabled: false },
            { id: 'ledger_submit', label: 'Submit', enabled: false },
          ],
        },
        {
          category: 'Proof',
          permissions: [
            { id: 'proof_view', label: 'View', enabled: true },
            { id: 'proof_upload', label: 'Upload', enabled: true },
            { id: 'proof_delete', label: 'Delete', enabled: false },
            { id: 'proof_verify', label: 'Verify', enabled: false },
          ],
        },
      ],
    },
    {
      id: 'auditor',
      name: 'Auditor',
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_create', label: 'Create', enabled: false },
            { id: 'proj_edit', label: 'Edit', enabled: false },
            { id: 'proj_delete', label: 'Delete', enabled: false },
            { id: 'proj_approve', label: 'Approve', enabled: false },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_create', label: 'Create', enabled: false },
            { id: 'ledger_edit', label: 'Edit', enabled: false },
            { id: 'ledger_delete', label: 'Delete', enabled: false },
            { id: 'ledger_approve', label: 'Approve', enabled: false },
            { id: 'ledger_submit', label: 'Submit', enabled: false },
          ],
        },
        {
          category: 'Proof',
          permissions: [
            { id: 'proof_view', label: 'View', enabled: true },
            { id: 'proof_upload', label: 'Upload', enabled: false },
            { id: 'proof_delete', label: 'Delete', enabled: false },
            { id: 'proof_verify', label: 'Verify', enabled: true },
          ],
        },
      ],
    },
  ]);

  const roles = [
    {
      name: 'Superadmin',
      description: 'Full system access with all permissions',
      totalPermissions: 43,
      isEditable: false,
      sections: [
        {
          category: 'System',
          permissions: [
            { id: 'sys_view', label: 'View', enabled: true },
            { id: 'sys_create', label: 'Create', enabled: true },
            { id: 'sys_edit', label: 'Edit', enabled: true },
            { id: 'sys_delete', label: 'Delete', enabled: true },
            { id: 'sys_manage', label: 'Manage Users', enabled: true },
          ],
        },
        {
          category: 'All Modules',
          permissions: [{ id: 'all_access', label: 'Full Access', enabled: true }],
        },
      ],
    },
    {
      name: 'Admin/Adviser',
      description: 'Approval authority and oversight capabilities',
      totalPermissions: 14,
      isEditable: false,
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_approve', label: 'Approve', enabled: true },
          ],
        },
        {
          category: 'Ledger',
          permissions: [
            { id: 'ledger_view', label: 'View', enabled: true },
            { id: 'ledger_approve', label: 'Approve', enabled: true },
            { id: 'ledger_verify', label: 'Verify', enabled: true },
          ],
        },
        {
          category: 'Permissions',
          permissions: [
            { id: 'perm_manage', label: 'Manage CSG Permissions', enabled: true },
            { id: 'perm_delegate', label: 'Delegate Authority', enabled: true },
          ],
        },
      ],
    },
    {
      name: 'CSG Officer',
      description: 'Create projects, manage ledger, and upload proofs',
      totalPermissions: 18,
      isEditable: true,
      sections: [],
    },
    {
      name: 'Student',
      description: 'Read-only access with engagement features',
      totalPermissions: 8,
      isEditable: true,
      sections: [
        {
          category: 'Projects',
          permissions: [
            { id: 'proj_view', label: 'View', enabled: true },
            { id: 'proj_rate', label: 'Rate', enabled: true },
          ],
        },
        {
          category: 'Engagement',
          permissions: [
            { id: 'engage_view', label: 'View Points', enabled: true },
            { id: 'engage_badges', label: 'View Badges', enabled: true },
            { id: 'engage_leaderboard', label: 'View Leaderboard', enabled: true },
          ],
        },
      ],
    },
  ];

  const [rolePermissions, setRolePermissions] = useState(roles);

  const filteredUsers = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    if (!q) return mockUsers;
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.studentId.includes(searchQuery)
    );
  }, [mockUsers, searchQuery]);

  const getCurrentRoleData = () => {
    if (selectedRole === 'CSG Officer') {
      const position = csgPositions.find(p => p.id === selectedCSGPosition);
      return {
        sections: position?.sections || [],
        name: `${selectedRole} - ${position?.name}`,
      };
    }

    const role = rolePermissions.find(r => r.name === selectedRole);
    return { sections: role?.sections || [], name: selectedRole };
  };

  const currentData = getCurrentRoleData();
  const currentRole = rolePermissions.find(r => r.name === selectedRole);

  const enabledCount = currentData.sections.reduce(
    (sum, section) => sum + section.permissions.filter(p => p.enabled).length,
    0
  );
  const totalCount = currentRole?.totalPermissions || 0;

  const handleTogglePermission = (sectionIndex, permissionId) => {
    if (!currentRole?.isEditable) {
      showToast('This role cannot be modified', 'error');
      return;
    }

    if (selectedRole === 'CSG Officer') {
      setCSGPositions(prevPositions =>
        prevPositions.map(position => {
          if (position.id !== selectedCSGPosition) return position;
          return {
            ...position,
            sections: position.sections.map((section, idx) => {
              if (idx !== sectionIndex) return section;
              return {
                ...section,
                permissions: section.permissions.map(p =>
                  p.id === permissionId ? { ...p, enabled: !p.enabled } : p
                ),
              };
            }),
          };
        })
      );
      return;
    }

    setRolePermissions(prevRoles =>
      prevRoles.map(role => {
        if (role.name !== selectedRole) return role;
        return {
          ...role,
          sections: role.sections.map((section, idx) => {
            if (idx !== sectionIndex) return section;
            return {
              ...section,
              permissions: section.permissions.map(p =>
                p.id === permissionId ? { ...p, enabled: !p.enabled } : p
              ),
            };
          }),
        };
      })
    );
  };

  const handleReset = () => {
    showToast('Permissions reset to default');
  };

  const handleSave = () => {
    showToast('Permissions saved successfully');
  };

  const handleSetOfficer = () => {
    if (!selectedUser || !selectedPosition) {
      showToast('Please select both a user and a position', 'error');
      return;
    }

    const user = mockUsers.find(u => u.id === selectedUser);
    const position = csgPositions.find(p => p.id === selectedPosition);
    if (!user || !position) return;

    setCouncilOfficers(prev =>
      prev.map(officer =>
        officer.position === selectedPosition
          ? { position: selectedPosition, name: user.name, userId: user.id, email: user.email }
          : officer
      )
    );

    showToast(`${user.name} has been assigned as ${position.name}`);
    setSelectedUser(null);
    setSelectedPosition('');
    setSearchQuery('');
    setIsSetOfficerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
            <p className="text-gray-500">Configure role-based access control</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="bg-[#2563EB] hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {activeDelegation && selectedRole === 'CSG Officer' && (
        <Card className="p-4 rounded-[20px] border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <strong>Delegation Active</strong> — Financial authority temporarily assigned to{' '}
                <strong>{activeDelegation.to}</strong> until <strong>{activeDelegation.until}</strong>
              </p>
            </div>
            <Button
              onClick={() => setActiveDelegation(null)}
              variant="outline"
              size="sm"
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            >
              End Delegation
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 rounded-[20px] border-0 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2563EB]" />
              CSG Council Officers
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage and assign council officer positions</p>
          </div>
          <Button onClick={() => setIsSetOfficerModalOpen(true)} className="bg-[#2563EB] hover:bg-blue-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Set New Officer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {councilOfficers.map((officer) => {
            const position = csgPositions.find(p => p.id === officer.position);
            const isVacant = !officer.name;

            return (
              <div
                key={officer.position}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isVacant ? 'border-dashed border-gray-300 bg-gray-50' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isVacant ? (
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-gray-400" />
                      </div>
                    ) : (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#2563EB] text-white text-xs">
                          {mockUsers.find(u => u.id === officer.userId)?.avatar || '--'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <h3 className={`text-sm ${isVacant ? 'text-gray-400' : 'text-gray-900'}`}>{position?.name}</h3>
                      <Badge className={`text-xs ${isVacant ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {isVacant ? 'Vacant' : 'Assigned'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {isVacant ? (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-400">No officer assigned</p>
                    <Button
                      onClick={() => {
                        setSelectedPosition(officer.position);
                        setIsSetOfficerModalOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full text-xs border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Assign Officer
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-900 mb-1">{officer.name}</p>
                    <p className="text-xs text-gray-500">{officer.email}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          setSelectedPosition(officer.position);
                          setIsSetOfficerModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                      >
                        <Repeat className="w-3 h-3 mr-1" />
                        Reassign Position
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {rolePermissions.map((role) => {
            const isSelected = selectedRole === role.name;
            return (
              <Card
                key={role.name}
                onClick={() => {
                  setSelectedRole(role.name);
                  if (role.name === 'CSG Officer') setSelectedCSGPosition('president');
                }}
                className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-[#2563EB] bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#2563EB]' : 'bg-gray-200'}`}>
                      {isSelected ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : role.isEditable ? (
                        <Users className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                      ) : (
                        <Lock className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <h3 className={`text-sm ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>{role.name}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`${isSelected ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {role.totalPermissions}
                    </Badge>
                    {!role.isEditable && (
                      <Badge className="bg-gray-200 text-gray-600 text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{role.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-[20px] border-0 shadow-sm bg-white p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#2563EB]" />
                  {currentData.name} Permissions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {currentRole?.isEditable ? 'Configure what this role can do' : 'This role has fixed permissions and cannot be modified'}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl text-[#2563EB]">{enabledCount}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-lg text-gray-500">{totalCount}</span>
                </div>
                <p className="text-xs text-gray-500">Active Permissions</p>
              </div>
            </div>

            {selectedRole === 'CSG Officer' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-700 mb-2 block">Select CSG Position to Configure</label>
                    <Select value={selectedCSGPosition} onValueChange={setSelectedCSGPosition} 
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          >
                      {csgPositions.map(position => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Configure permissions for each CSG officer position individually. Each position can have different access levels.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {currentData.sections.map((section, sectionIndex) => (
                <div key={section.category}>
                  <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#2563EB] rounded"></div>
                    {section.category}
                  </h3>
                  <div className="space-y-3 ml-3">
                    {section.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                          currentRole?.isEditable ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${permission.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {permission.enabled ? <Check className="w-4 h-4 text-green-600" /> : <span className="text-gray-400 text-sm">✕</span>}
                          </div>
                          <span className={`text-sm ${permission.enabled ? 'text-gray-900' : 'text-gray-500'}`}>{permission.label}</span>
                          {!currentRole?.isEditable && <Lock className="w-3 h-3 text-gray-400" />}
                        </div>
                        <Switch
                          checked={permission.enabled}
                          onCheckedChange={() => handleTogglePermission(sectionIndex, permission.id)}
                          disabled={!currentRole?.isEditable}
                          className="data-[state=checked]:bg-[#2563EB]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-6 p-4 rounded-xl border ${currentRole?.isEditable ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start gap-3">
                {currentRole?.isEditable ? (
                  <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-gray-900 mb-1">{currentRole?.isEditable ? 'Permission Changes' : 'Protected Role'}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {currentRole?.isEditable
                      ? 'Changes to permissions will take effect immediately after saving. Users currently logged in will need to refresh their session to see the updates.'
                      : 'This role has system-level permissions that are fixed and cannot be modified to ensure system security and proper governance structure.'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={isSetOfficerModalOpen}
        onClose={() => setIsSetOfficerModalOpen(false)}
        title="Set CSG Officer"
        description="Assign a student as a CSG officer position."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div className="flex-1">
              <label className="text-sm text-gray-700 mb-2 block">Select CSG Position</label>
              <Select
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          value={selectedPosition} onValueChange={setSelectedPosition}>
                <option value="" disabled>Select position</option>
                {csgPositions.map(position => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div className="flex-1">
              <label className="text-sm text-gray-700 mb-2 block">Search User</label>
              <input 
          className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Name, Email, or Student ID" />
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    selectedUser === user.id ? 'bg-blue-50 border-2 border-[#2563EB]' : 'bg-gray-50 border-2 border-transparent hover:border-blue-200'
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`text-xs ${selectedUser === user.id ? 'bg-[#2563EB] text-white' : 'bg-gray-300 text-gray-700'}`}>
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">ID: {user.studentId}</p>
                  </div>
                  {selectedUser === user.id && <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" />}
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No users found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={() => setIsSetOfficerModalOpen(false)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleSetOfficer} className="bg-[#2563EB] hover:bg-blue-700 text-white">
            Set Officer
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function AdviserPermissionPage() {
  return (
    <AuthenticatedLayout>
      <Head title="Role Permissions" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <RolePermissionsPage />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}