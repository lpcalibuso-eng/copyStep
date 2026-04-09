import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from 'react-hot-toast'; 
import {
  Edit,
  Trash2,
  Send,
  Plus,
  FileText,
  Upload,
  Shield,
  X,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

export function showToast(message, type = 'success') {
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

export function Modal({ open, onClose, title, description, children }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function FieldLabel({ children }) {
  return <label className="block text-sm text-gray-700 mb-1">{children}</label>;
}

function Select({ className = '', children, value, onValueChange, ...props }) {
  return (
    <select
      className={[
        'w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
        className,
      ].join(' ')}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
}

// function Switch({ checked, onCheckedChange, label }) {
//   return (
//     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//       <span className="text-sm text-gray-700">{label}</span>
//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onCheckedChange(!checked)}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
//       >
//         <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
//       </button>
//     </div>
//   );
// }

// ─── Edit Project Modal ──────────────────────────────────────────────────────

export function EditProjectModal({
  open,
  onClose,
  editForm,
  setEditForm,
  editBudgetItems,
  setEditBudgetItems,
  onSave,
  projectId,
}) {
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const calculateItemTotal = (item) => {
    if (item.qty && item.unitPrice) {
      const quantity = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return quantity * unitPrice;
    }
    return parseFloat(item.amount) || 0;
  };

  const calculateGrandTotal = (items = editBudgetItems) =>
    items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const updateItem = (id, field, value) => {
    setEditBudgetItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'qty' || field === 'unitPrice') {
            const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(item.qty) || 0;
            const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
            updatedItem.amount = qty * unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      item: '',
      qty: '1',
      unitPrice: '',
      amount: 0
    };
    setEditBudgetItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    if (editBudgetItems.length > 1) {
      setEditBudgetItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { 
      showToast('File size must be less than 10MB', 'error'); 
      return; 
    }
    setSelectedFile(file);
    setFilePreview({ 
      name: file.name, 
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
    });
  };

  const handleSave = async () => {
  if (!editForm.title || !editForm.category || !editForm.description || !editForm.proposedBy) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  setIsUploading(true);
  
  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel method spoofing
    
    // Include ALL fields, preserving existing data
    formData.append('title', editForm.title);
    formData.append('description', editForm.description);
    formData.append('objective', editForm.objective || '');
    formData.append('venue', editForm.venue || '');
    formData.append('category', editForm.category);
    formData.append('budget', calculateGrandTotal());
    
    // CRITICAL: Ensure all budget items have qty and unitPrice
    const sanitizedBudgetItems = editBudgetItems.map(item => ({
      ...item,
      qty: item.qty || '1',
      unitPrice: item.unitPrice || '0',
      amount: (parseFloat(item.qty || '0') || 0) * (parseFloat(item.unitPrice || '0') || 0)
    }));
    
    formData.append('budget_breakdown', JSON.stringify(sanitizedBudgetItems));
    formData.append('proposed_by', editForm.proposedBy);
    formData.append('start_date', editForm.startDate);
    formData.append('end_date', editForm.endDate);
    
    // CRITICAL: Preserve existing fields
    formData.append('status', editForm.status || 'Draft');
    formData.append('approval_status', editForm.approvalStatus || 'Draft');
    formData.append('archive', editForm.archive !== undefined ? editForm.archive : 0);
    formData.append('note', editForm.note || '');
    formData.append('approve_by', editForm.approveBy || '');
    
    // Append file if selected
    if (selectedFile) {
      formData.append('project_proof', selectedFile);
    }

    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': token,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (!res.ok) {
      let msg = 'Failed to update project';
      try {
        const errData = await res.json();
        if (errData && errData.message) msg = errData.message;
      } catch {}
      throw new Error(msg);
    }
    
    const updatedProject = await res.json();
    
    // CRITICAL FIX: Ensure budget breakdown is properly included in response
    const enhancedProject = {
      ...updatedProject,
      data: {
        ...(updatedProject.data || {}),
        budget_breakdown: updatedProject.data?.budget_breakdown || updatedProject.budget_breakdown || sanitizedBudgetItems,
        budgetBreakdown: updatedProject.data?.budgetBreakdown || updatedProject.budgetBreakdown || sanitizedBudgetItems
      }
    };
    
    showToast('Project updated successfully', 'success');
    onSave(enhancedProject);
    handleClose();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setIsUploading(false);
  }
};

  const handleClose = () => {
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Edit Project" description="Update project information">
      <div className="space-y-4">
        {/* Project Title */}
        <div>
          <FieldLabel>Project Title *</FieldLabel>
          <Input
            value={editForm.title || ''}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <FieldLabel>Category *</FieldLabel>
          <Select value={editForm.category || ''} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
            <option value="">Select category</option>
            <option value="Social">Social</option>
            <option value="Sports">Sports</option>
            <option value="Environmental">Environmental</option>
            <option value="Technology">Technology</option>
            <option value="Cultural">Cultural</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
          </Select>
        </div>

        {/* Objective */}
        <div>
          <FieldLabel>Objective *</FieldLabel>
          <Textarea
            placeholder="Describe the main objective of the project"
            value={editForm.objective || ''}
            onChange={(e) => setEditForm({ ...editForm, objective: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Description *</FieldLabel>
          <Textarea
            placeholder="Describe the project details and goals"
            value={editForm.description || ''}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Venue */}
        <div>
          <FieldLabel>Venue *</FieldLabel>
          <Input
            placeholder="Enter project venue/location"
            value={editForm.venue || ''}
            onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Budget Breakdown */}
        <div className="space-y-4">
          <FieldLabel>Budget Breakdown (₱)</FieldLabel>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {editBudgetItems.map((item) => (
              <div key={item.id} className="flex gap-2 items-start">
                <Input
                  placeholder="Item name"
                  value={item.item}
                  onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                  className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                  className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                  ₱{(item.amount || 0).toLocaleString()}
                </div>
                {editBudgetItems.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeItem(item.id)} 
                    className="rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              type="button" 
              onClick={addItem} 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Item
            </Button>
          </div>

          <div>
            <FieldLabel>Total Budget (₱)</FieldLabel>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-3xl font-semibold text-blue-900">
                ₱{calculateGrandTotal().toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Auto-calculated from (Quantity × Unit Price)
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <FieldLabel>Project Budget Proof (Optional)</FieldLabel>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-600 mt-2">Click to upload new file</p>
              <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            {filePreview && (
              <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{filePreview.name}</p>
                    <p className="text-xs text-gray-500">{filePreview.size}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { 
                    setFilePreview(null); 
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = ''; 
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Proposed By */}
        <div>
          <FieldLabel>Proposed by *</FieldLabel>
          <Input
            placeholder="Enter name of proposer"
            value={editForm.proposedBy || ''}
            onChange={(e) => setEditForm({ ...editForm, proposedBy: e.target.value })}
            className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Start Date</FieldLabel>
            <Input 
              type="date" 
              value={editForm.startDate || ''} 
              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} 
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white" 
            />
          </div>
          <div>
            <FieldLabel>End Date</FieldLabel>
            <Input 
              type="date" 
              value={editForm.endDate || ''} 
              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} 
              className="w-full h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white" 
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 bottom-0 bg-white py-4 border-t">
          <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl" disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={!editForm.title || !editForm.category || !editForm.description || !editForm.proposedBy || isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
// ─── Submit for Approval Modal ───────────────────────────────────────────────

export function SubmitConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Submit Project for Adviser Approval?" description="Once submitted, you cannot edit the project until the adviser reviews it.">
      <div className="pt-6">
        <p className="text-sm text-gray-600 mb-6">Make sure all details are correct before submitting.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">Submit</Button>
        </div>
      </div>
    </Modal>
  );
}

export function SubmitLedgerConfirmModal({ open, onClose, onConfirm, ledger }) {
  const title = ledger ? 'Submit Ledger Entry for Approval?' : 'Submit Ledger Entry?';
  const description = ledger
    ? `Submit ledger entry ${ledger.id?.substring(0, 8) || ''} for adviser approval? Once submitted, it cannot be edited.`
    : 'Submit ledger entry for adviser approval?';

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="pt-6">
        <p className="text-sm text-gray-600 mb-6">Confirm you want to submit this ledger entry so adviser can review it.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">Submit</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────

export function DeleteConfirmModal({ open, onClose, onConfirm, title = 'Delete item?', description = 'Are you sure you want to delete this item? This action cannot be undone.' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white">Delete</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Ledger Entry Modal ──────────────────────────────────────────────────

// In ProjectEdit.js - Fixed AddLedgerModal
export function AddLedgerModal({ open, onClose, ledgerForm, setLedgerForm, onSave, projectId, projectBudgetBreakdown = [] }) {
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Budget items state for the ledger entry
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }
  ]);

  // Calculate item total
  const calculateItemTotal = (item) => {
    if (item.qty && item.unitPrice) {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return qty * unitPrice;
    }
    return parseFloat(item.amount) || 0;
  };

  // Calculate total budget from all items
  const calculateTotalBudget = () => {
    return budgetItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  // Add budget item
  const addBudgetItem = () => {
    const newId = budgetItems.length > 0 
      ? Math.max(...budgetItems.map(item => item.id)) + 1 
      : 1;
    setBudgetItems([...budgetItems, { 
      id: newId, 
      item: '', 
      quantity: 1, 
      unitPrice: '', 
      amount: 0 
    }]);
  };

  // Remove budget item
  const removeBudgetItem = (id) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter(item => item.id !== id));
    }
  };

  // Update budget item
  const updateBudgetItem = (id, field, value) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'qty' || field === 'unitPrice') {
          const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(item.qty) || 0;
          const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
          updatedItem.amount = qty * unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { 
      showToast('File size must be less than 10MB', 'error'); 
      return; 
    }
    
    setSelectedFile(file);
    setFilePreview({ 
      name: file.name, 
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
    });
  };

  // Reset form
  const resetForm = () => {
    setBudgetItems([{ id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }]);
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLedgerForm({ 
      type: 'Expense', 
      description: '', 
      category: '',
      referenceNumber: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle save
//   const handleSave = async () => {
//     if (e) e.preventDefault();
//     setIsUploading(true);

//     // Validate required fields
//     if (!ledgerForm.description) {
//       showToast('Please fill in description', 'error');
//       return;
//     }

//     // Validate budget items
//     const hasEmptyItems = budgetItems.some(item => !item.item || !item.unitPrice || item.quantity <= 0);
//     if (hasEmptyItems) {
//       showToast('Please fill in all budget items', 'error');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
//       // Create FormData for file upload
//       // const formData = new FormData();
//       // formData.append('project_id', projectId);
//       // formData.append('type', ledgerForm.type);
//       // formData.append('description', ledgerForm.description);
//       // formData.append('amount', calculateTotalBudget().toString());
//       // formData.append('budget_breakdown', JSON.stringify(budgetItems));
//       // formData.append('project_budget_breakdown', JSON.stringify(projectBudgetBreakdown || []));
//       // formData.append('approval_status', 'Draft');

// // 1. Create FormData and append ALL necessary fields
//       const formData = new FormData();
//       formData.append('project_id', projectId);
//       formData.append('type', ledgerForm.type);
//       formData.append('description', ledgerForm.description);
//       formData.append('amount', calculateTotalBudget().toString());
//       formData.append('budget_breakdown', JSON.stringify(budgetItems));
//       formData.append('project_budget_breakdown', JSON.stringify(projectBudgetBreakdown || []));
//       formData.append('date', ledgerForm.date || new Date().toISOString().split('T')[0]);
//       formData.append('approval_status', 'Draft');

      
//       // // Append file if selected
//       // if (selectedFile) {
//       //   formData.append('ledger_proof', selectedFile);
//       // }

//       // const res = await fetch('/api/ledger-entries', {
//       //   method: 'POST',
//       //   headers: {
//       //     'X-CSRF-TOKEN': token,
//       //     'Accept': 'application/json',
//       //   },
//       //   body: formData,
//       // });

//       if (selectedFile) {
//         formData.append('proof_file', selectedFile);
//       }

//       // 3. Define 'res' (The Response)
//       const res = await fetch('/api/ledger-entries', {
//         method: 'POST',
//         headers: {
//           'X-CSRF-TOKEN': token,
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest',
//         },
//         body: formData,
//       });
      
//       // if (!res.ok) {
//       //   let msg = 'Failed to create ledger entry';
//       //   try {
//       //     const errData = await res.json();
//       //     if (errData && errData.message) msg = errData.message;
//       //   } catch {}
//       //   throw new Error(msg);
//       // }
      
// // 4. Handle the Response
//       if (res.ok) {
//         const result = await res.json();
        
//         // Show success toast
//         toast.success(result.message || "Entry created successfully!");
        
//         // Update the UI via your onSave prop/callback
//         if (onSave) {
//           onSave(result.data || result); 
//         }
        
//         handleClose(); // Close the modal
//       } else {
//         // Handle Server Errors (e.g., Validation failed)
//         let errorMsg = 'Failed to create ledger entry';
//         try {
//           const errData = await res.json();
//           errorMsg = errData.message || errorMsg;
//         } catch (parseError) {
//           // If response isn't JSON
//         }
//         toast.error(errorMsg);
//       }

//     //   const newEntry = await res.json();
//     //   onSave(newEntry);
//     //   handleClose();
//     // } catch (err) {
//     //   showToast(err.message, 'error');
//     // } finally {
//     //   setIsUploading(false);
//     // }

//     } catch (err) {
//       // Handle Network Errors (e.g., Server is offline)
//       console.error("Fetch Error:", err);
//       toast.error("Network error: Could not reach the server.");
//     } finally {
//       setIsUploading(false); // Stop loading state
//     }

//   };

const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsUploading(true); // Start loading state

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // 1. Create FormData and append ALL necessary fields
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('type', ledgerForm.type);
      formData.append('description', ledgerForm.description);
      formData.append('amount', calculateTotalBudget().toString());
      formData.append('budget_breakdown', JSON.stringify(budgetItems));
      formData.append('project_budget_breakdown', JSON.stringify(projectBudgetBreakdown || []));
      formData.append('date', ledgerForm.date || new Date().toISOString().split('T')[0]);
      formData.append('approval_status', 'Draft');
      
      // 2. IMPORTANT: Use 'proof_file' to match your Laravel Controller
      if (selectedFile) {
        formData.append('proof_file', selectedFile);
      }

      console.log('📤 Sending ledger entry to /api/ledger-entries...');

      // 3. Define 'res' (The Response)
      const res = await fetch('/api/ledger-entries', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      console.log('📥 Response received - Status:', res.status, res.statusText);
      console.log('📥 Response headers:', {
        'Content-Type': res.headers.get('Content-Type'),
        'Content-Length': res.headers.get('Content-Length')
      });

      // 4. Handle the Response
      if (res.ok) {
        console.log('✅ Response is OK (2xx status), attempting to parse JSON...');
        let result = null;
        let parseErr = null;
        
        try {
          result = await res.json();
          console.log('✅ JSON parsed successfully:', result);
        } catch (e) {
          parseErr = e;
          console.warn('⚠️ Could not parse response as JSON, but status was OK');
          console.log('Parse error:', e.message);
        }

        // Whether we got JSON or not, if status is 201, assume success
        // (Server may crash after sending 201 header but before body)
        toast.success(result?.message || "Entry created successfully!");
        
        // Close the modal FIRST
        handleClose();
        
        // Then call onSave to trigger a fresh fetch from the database
        if (onSave) {
          onSave({
            success: true,
            id: result?.id,
            message: result?.message || 'Entry created successfully',
            refresh: true  // Signal to fetch fresh data
          });
        }
      } else if (res.status === 422 || res.status === 400) {
        // Validation error - try to parse error details
        console.log('❌ Validation error:', res.status);
        let errorMsg = 'Validation failed';
        try {
          const errData = await res.json();
          console.error('Server error response:', errData);
          errorMsg = errData.message || errorMsg;
          if (errData.errors) {
            const errorList = Object.entries(errData.errors)
              .map(([key, messages]) => `${key}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n');
            errorMsg += `\n\n${errorList}`;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
          errorMsg += ` (Status: ${res.status})`;
        }
        toast.error(errorMsg);
      } else {
        // Other server errors
        console.log('❌ Server error:', res.status);
        let errorMsg = `Server error (${res.status})`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (parseError) {
          console.error('Could not parse error:', parseError);
        }
        toast.error(errorMsg);
      }
    } catch (err) {
      // Handle Network Errors (e.g., Server is offline)
      console.error("❌ Fetch Error:", err.message);
      console.error("Full error:", err);
      
      // Network error
      toast.error("Network error: " + (err.message || "Could not reach the server."));
    } finally {
      setIsUploading(false); // Stop loading state
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Ledger Entry" description="Create a new ledger entry for this project">
      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <FieldLabel>Type *</FieldLabel>
          <Select
            className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={ledgerForm.type}
            onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </Select>
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Description *</FieldLabel>
          <Textarea 
            placeholder="Enter transaction description" 
            value={ledgerForm.description} 
            onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })} 
            rows={3} 
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white" 
          />
        </div>

        {/* Budget Breakdown Section */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>Budget Breakdown (₱)</FieldLabel>
            <div className="space-y-3">
              {budgetItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Item name"
                    value={item.item}
                    onChange={(e) => updateBudgetItem(item.id, 'item', e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateBudgetItem(item.id, 'qty', e.target.value)}
                    className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateBudgetItem(item.id, 'unitPrice', e.target.value)}
                    className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                  />
                  <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                    ₱{(item.amount || 0).toLocaleString()}
                  </div>
                  {budgetItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBudgetItem(item.id)}
                      className="rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addBudgetItem}
                variant="outline"
                size="sm"
                className="w-full rounded-xl"
                 disabled={budgetItems.some(item => !item.item || !item.unitPrice || item.quantity <= 0)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Budget Item
              </Button>
            </div>
          </div>
          
          <div>
            <FieldLabel>Total Amount (₱)</FieldLabel>
            <div className="bg-blue-50 rounded-xl p-4 mt-1">
              <p className="text-3xl font-semibold text-blue-900">
                ₱{calculateTotalBudget().toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Auto-calculated from breakdown items
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <FieldLabel>Attach Proof Document (Optional)</FieldLabel>
          <div className="flex flex-col items-center gap-3">
            <button 
              type="button" 
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-600 mt-2">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            {filePreview && (
              <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{filePreview.name}</p>
                    <p className="text-xs text-gray-500">{filePreview.size}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { 
                    setFilePreview(null); 
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = ''; 
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 bottom-0 bg-white py-4 border-t">
          <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl" disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={!ledgerForm.description || isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Ledger Entry Modal ─────────────────────────────────────────────────

export function EditLedgerModal({ open, onClose, ledgerForm, setLedgerForm, onSave }) {
  console.log('🎯 EditLedgerModal rendered with props:', { open, ledgerForm, onSave: !!onSave });

  // State for budget items in edit mode
  const [editBudgetItems, setEditBudgetItems] = useState([]);
  
  // File upload states
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Initialize budget items when ledgerForm changes (for editing)
  useEffect(() => {
    console.log('🔄 EditLedgerModal useEffect triggered, ledgerForm:', ledgerForm);
    if (ledgerForm.budgetBreakdown && ledgerForm.budgetBreakdown.length > 0) {
      // Convert existing budget breakdown to the format needed for editing
      const formattedItems = ledgerForm.budgetBreakdown.map((item, index) => ({
        id: item.id || index + 1,
        item: item.item || '',
        qty: item.quantity || item.qty || 1,
        unitPrice: item.unitPrice || 0,
        amount: item.amount || 0
      }));
      console.log('📋 Formatted budget items:', formattedItems);
      setEditBudgetItems(formattedItems);
    } else {
      // Default empty item if no budget breakdown exists
      console.log('📋 No budget breakdown, using default');
      setEditBudgetItems([{ id: 1, item: '', qty: 1, unitPrice: '', amount: 0 }]);
    }
  }, [ledgerForm.budgetBreakdown]);

  const calculateItemTotal = (item) => {
    if (item.qty && item.unitPrice) {
      const quantity = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return quantity * unitPrice;
    }
    return parseFloat(item.amount) || 0;
  };

  const calculateGrandTotal = (items = editBudgetItems) =>
    items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const updateItem = (id, field, value) => {
    setEditBudgetItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'qty' || field === 'unitPrice') {
            const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(item.qty) || 0;
            const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(item.unitPrice) || 0;
            updatedItem.amount = qty * unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const addItem = () => {
    const newId = editBudgetItems.length > 0 
      ? Math.max(...editBudgetItems.map(item => item.id)) + 1 
      : 1;
    setEditBudgetItems((prev) => [...prev, {
      id: newId,
      item: '',
      qty: 1,
      unitPrice: '',
      amount: 0
    }]);
  };

  const removeItem = (id) => {
    if (editBudgetItems.length > 1) {
      setEditBudgetItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { 
      showToast('File size must be less than 10MB', 'error'); 
      return; 
    }
    
    setSelectedFile(file);
    setFilePreview({ 
      name: file.name, 
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
    });
  };

 const handleSave = async () => {
  console.log('💾 EditLedgerModal handleSave called');
  console.log('📋 Current ledgerForm:', ledgerForm);
  console.log('📋 Current editBudgetItems:', editBudgetItems);

  // Validate required fields
  if (!ledgerForm.description) {
    console.log('❌ Validation failed: missing description');
    showToast('Please enter a description', 'error');
    return;
  }

  // Validate budget items
  const hasEmptyItems = editBudgetItems.some(item => !item.item || !item.unitPrice || item.qty <= 0);
  if (hasEmptyItems) {
    console.log('❌ Validation failed: empty budget items');
    showToast('Please fill in all budget item details', 'error');
    return;
  }

  setIsUploading(true);
  console.log('🔄 Starting upload process...');

  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    console.log('🔑 CSRF token:', token ? 'present' : 'missing');

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('type', ledgerForm.type || 'Expense');
    formData.append('description', ledgerForm.description);
    formData.append('category', ledgerForm.category || '');
    formData.append('reference_number', ledgerForm.referenceNumber || '');
    formData.append('budget_breakdown', JSON.stringify(editBudgetItems));
    formData.append('amount', calculateGrandTotal().toString());

    console.log('📦 FormData contents:', {
      type: ledgerForm.type,
      description: ledgerForm.description,
      category: ledgerForm.category,
      reference_number: ledgerForm.referenceNumber,
      budget_breakdown: JSON.stringify(editBudgetItems),
      amount: calculateGrandTotal().toString(),
      hasFile: !!selectedFile,
    });

    // Append file if selected
    if (selectedFile) {
      formData.append('ledger_proof', selectedFile);
      console.log('📎 File attached:', selectedFile.name);
    } else {
      console.log('📎 No new file selected');
    }

    const ledgerId = ledgerForm.id;
    console.log('🎯 Making PUT request to:', `/api/ledger-entries/${ledgerId}`);

    const res = await fetch(`/api/ledger-entries/${ledgerId}`, {
      method: 'PUT',
      headers: {
        'X-CSRF-TOKEN': token,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    console.log('📡 Response status:', res.status);

    if (!res.ok) {
      let msg = 'Failed to update ledger entry';
      try {
        const errData = await res.json();
        console.log('❌ Error response:', errData);
        if (errData && errData.message) msg = errData.message;
      } catch (parseErr) {
        console.log('❌ Could not parse error response:', parseErr);
      }
      throw new Error(msg);
    }

    const responseData = await res.json();
    console.log('✅ Success response:', responseData);

    // Call onSave with the updated entry
    onSave(responseData);
    handleClose();
    showToast('Ledger successfully edited', 'success');
    console.log('✅ Ledger entry updated successfully');
  } catch (err) {
    console.log('💥 Error in handleSave:', err);
    showToast(err.message, 'error');
  } finally {
    setIsUploading(false);
    console.log('🔄 Upload process finished');
  }
};

  const handleClose = () => {
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Edit Ledger Entry" description="Update ledger entry information">
      <div className="space-y-4">
        <div>
          <FieldLabel>Type</FieldLabel>
          <select 
            className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200" 
            value={ledgerForm.type} 
            onChange={(e) => setLedgerForm({ ...ledgerForm, type: e.target.value })}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        
        <div>
          <FieldLabel>Description</FieldLabel>
          <Textarea 
            value={ledgerForm.description} 
            onChange={(e) => setLedgerForm({ ...ledgerForm, description: e.target.value })} 
            rows={3} 
            className="w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white" 
          />
        </div>
        
        <div className="space-y-4">
          <FieldLabel>Budget Breakdown (₱)</FieldLabel>
          <div className="space-y-4">
            {editBudgetItems.map((item) => (
              <div key={item.id} className="flex gap-2 items-start">
                <Input
                  placeholder="Item name"
                  value={item.item}
                  onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                  className="w-20 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                  className="w-28 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white"
                />
                <div className="w-28 h-10 flex items-center justify-end px-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                  ₱{(item.amount || 0).toLocaleString()}
                </div>
                {editBudgetItems.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeItem(item.id)} 
                    className="rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button 
              type="button" 
              onClick={addItem} 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Item
            </Button>
          </div>

          <div>
            <FieldLabel>Total Budget (₱)</FieldLabel>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-3xl font-semibold text-blue-900">
                ₱{calculateGrandTotal().toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Auto-calculated from (Quantity × Unit Price)
              </p>
            </div>
          </div>

          <div>
            <FieldLabel>Ledger Proof Document (Optional)</FieldLabel>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-6 h-6 text-gray-500" />
                <p className="text-sm text-gray-600 mt-2">Click to upload new file</p>
                <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              {filePreview && (
                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{filePreview.name}</p>
                      <p className="text-xs text-gray-500">{filePreview.size}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { 
                      setFilePreview(null); 
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = ''; 
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {ledgerForm.existingProof && !selectedFile && (
                <div className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Existing Proof Document</p>
                      <p className="text-xs text-gray-500">Current file will be kept unless replaced</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl" disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Upload Proof Modal ──────────────────────────────────────────────────────

export function UploadProofModal({ open, onClose, proofForm, setProofForm, ledgerEntries, onSave }) {
  return (
    <Modal open={open} onClose={onClose} title="Upload Proof of Transaction" description="Upload supporting documents for ledger entries">
      <div className="space-y-4">
        <div>
          <FieldLabel>Linked Ledger Entry</FieldLabel>
          <select
            className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={proofForm.linkedTransaction}
            onChange={(e) => setProofForm({ ...proofForm, linkedTransaction: e.target.value })}
          >
            <option value="">Select transaction</option>
            {ledgerEntries.filter((e) => e.requiresProof).map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.id} - {entry.description}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Upload File (PNG, JPG, PDF)</FieldLabel>
          <div className="flex flex-col items-center gap-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG or PDF (MAX. 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".png,.jpg,.jpeg,.pdf" 
                onChange={(e) => { 
                  const file = e.target.files?.[0]; 
                  if (file) setProofForm({ ...proofForm, fileName: file.name }); 
                }} 
              />
            </label>
            {proofForm.fileName && (
              <div className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{proofForm.fileName}</span>
                </div>
                <button onClick={() => setProofForm({ ...proofForm, fileName: '' })} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">Your file will be hashed using SHA-256 for verification and immutability.</p>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button 
            onClick={onSave} 
            disabled={!proofForm.linkedTransaction || !proofForm.fileName} 
            className="text-white flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Action Buttons (used in ProjectDetails header) ─────────────────────

export function EditActionButtons({ onSubmit, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onSubmit} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
        <Send className="w-4 h-4 mr-2" />Submit for Adviser Approval
      </Button>
      <Button onClick={onEdit} variant="outline" className="rounded-xl">
        <Edit className="w-4 h-4 mr-2" />Edit Project
      </Button>
      <Button onClick={onDelete} variant="outline" className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="w-4 h-4 mr-2" />Delete Project
      </Button>
    </div>
  );
}