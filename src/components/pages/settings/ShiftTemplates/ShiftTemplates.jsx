import { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  ConfirmationDialog,
  DashboardTimePicker,
  LoadingScreen,
  LottieLoader,
  dashboardToast,
} from '../../../common';
import { getApiErrorMessage } from '../../../../utils/apiError';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsContentGrid,
} from '../SettingsSection/SettingsSection';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_BTN_SECONDARY, SETTINGS_PANEL } from '../settingsTheme';
import {
  useCreateShiftTemplateMutation,
  useDeleteShiftTemplateMutation,
  useGetShiftTemplatesQuery,
  useUnassignAndDeleteShiftTemplateMutation,
  useUpdateShiftTemplateMutation,
} from '../../../../store/api/shiftApi';
import { useGetSettingsQuery } from '../../../../store/api/settingsApi';

const emptyBreak = () => ({
  name: 'Lunch',
  start_time: '13:00',
  end_time: '14:00',
  is_paid: false,
});

const emptyForm = () => ({
  name: '',
  work_start_time: '09:00',
  work_end_time: '17:00',
  breaks: [],
});

const normalizeTime = (value, fallback = '09:00') => {
  if (!value) return fallback;
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
};

const ShiftTemplates = () => {
  const { data: settings } = useGetSettingsQuery();
  const { data: templates = [], isLoading, error, refetch } = useGetShiftTemplatesQuery();
  const [createTemplate, { isLoading: creating }] = useCreateShiftTemplateMutation();
  const [updateTemplate, { isLoading: updating }] = useUpdateShiftTemplateMutation();
  const [deleteTemplate, { isLoading: deleting }] = useDeleteShiftTemplateMutation();
  const [unassignAndDelete, { isLoading: forceDeleting }] =
    useUnassignAndDeleteShiftTemplateMutation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const perEmployee = settings?.shift_schedule_mode === 'per_employee';

  useEffect(() => {
    if (!editingId) return;
    const current = templates.find((t) => t.id === editingId);
    if (!current) return;
    setForm({
      name: current.name,
      work_start_time: normalizeTime(current.work_start_time),
      work_end_time: normalizeTime(current.work_end_time),
      breaks: (current.breaks || []).map((b) => ({
        name: b.name,
        start_time: normalizeTime(b.start_time, '13:00'),
        end_time: normalizeTime(b.end_time, '14:00'),
        is_paid: Boolean(b.is_paid),
      })),
    });
  }, [editingId, templates]);

  const saving = creating || updating;

  const title = useMemo(
    () => (editingId ? 'Edit shift template' : 'New shift template'),
    [editingId]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    if (!form.name.trim()) {
      const message = 'Template name is required';
      setSaveError(message);
      dashboardToast.error(message);
      return;
    }
    if (form.work_start_time === form.work_end_time) {
      const message = 'Start and end times cannot be the same';
      setSaveError(message);
      dashboardToast.error(message);
      return;
    }
    for (const br of form.breaks) {
      if (!br.name.trim()) {
        const message = 'Each break needs a name';
        setSaveError(message);
        dashboardToast.error(message);
        return;
      }
      if (br.start_time === br.end_time) {
        const message = `Break "${br.name}" start and end cannot be the same`;
        setSaveError(message);
        dashboardToast.error(message);
        return;
      }
    }

    try {
      if (editingId) {
        await updateTemplate({ id: editingId, ...form }).unwrap();
        dashboardToast.success('Shift template updated');
      } else {
        await createTemplate(form).unwrap();
        dashboardToast.success('Shift template created');
      }
      resetForm();
      refetch();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not save shift template');
      setSaveError(message);
      dashboardToast.error(message, 'Save failed');
    }
  };

  const handleDelete = async (template) => {
    try {
      await deleteTemplate(template.id).unwrap();
      dashboardToast.success('Template deleted');
      if (editingId === template.id) resetForm();
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not delete template');
      if (err?.status === 409 || message.toLowerCase().includes('assigned')) {
        setDeleteTarget({ template, force: true, error: null });
        return;
      }
      dashboardToast.error(message, 'Delete failed');
    }
  };

  const handleForceDelete = async () => {
    if (!deleteTarget?.template) return;
    try {
      await unassignAndDelete(deleteTarget.template.id).unwrap();
      dashboardToast.success('Template unassigned and deleted');
      if (editingId === deleteTarget.template.id) resetForm();
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not force-delete template');
      setDeleteTarget((current) => (current ? { ...current, error: message } : current));
      dashboardToast.error(message, 'Delete failed');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading shift templates..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Could not load shift templates.</p>
        <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-tour="shift-templates">
      {!perEmployee && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Shift schedule mode is <strong>same for all</strong>. You can still create templates
          here, then enable <strong>Per employee</strong> under Attendance rules to assign Mon–Sun
          schedules.
        </div>
      )}

      <SettingsContentGrid>
        <SettingsSection title={title} subtitle="Named hours with optional lunch/tea breaks">
          <div className="space-y-4">
            <div>
              <label className={settingsLabelClass}>Name</label>
              <input
                className={settingsInputClass}
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Morning, Night, Evening…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={settingsLabelClass}>Start</label>
                <DashboardTimePicker
                  id="shift-start"
                  label="Shift start"
                  value={form.work_start_time}
                  onChange={(work_start_time) => setForm((p) => ({ ...p, work_start_time }))}
                />
              </div>
              <div>
                <label className={settingsLabelClass}>End</label>
                <DashboardTimePicker
                  id="shift-end"
                  label="Shift end"
                  value={form.work_end_time}
                  onChange={(work_end_time) => setForm((p) => ({ ...p, work_end_time }))}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Overnight shifts are allowed (e.g. 22:00–06:00). End can be before start.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={settingsLabelClass}>Breaks</label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#007AFF]"
                  onClick={() =>
                    setForm((p) => ({ ...p, breaks: [...p.breaks, emptyBreak()] }))
                  }
                >
                  + Add break
                </button>
              </div>
              {form.breaks.length === 0 && (
                <p className="text-xs text-gray-500">No breaks — optional (lunch, tea, …).</p>
              )}
              {form.breaks.map((br, idx) => (
                <div
                  key={`break-${idx}`}
                  className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      className={settingsInputClass}
                      value={br.name}
                      onChange={(e) =>
                        setForm((p) => {
                          const breaks = [...p.breaks];
                          breaks[idx] = { ...breaks[idx], name: e.target.value };
                          return { ...p, breaks };
                        })
                      }
                      placeholder="Lunch / Tea"
                    />
                    <button
                      type="button"
                      className="shrink-0 text-xs text-red-600"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          breaks: p.breaks.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <DashboardTimePicker
                      id={`break-start-${idx}`}
                      label="Break start"
                      value={br.start_time}
                      onChange={(start_time) =>
                        setForm((p) => {
                          const breaks = [...p.breaks];
                          breaks[idx] = { ...breaks[idx], start_time };
                          return { ...p, breaks };
                        })
                      }
                    />
                    <DashboardTimePicker
                      id={`break-end-${idx}`}
                      label="Break end"
                      value={br.end_time}
                      onChange={(end_time) =>
                        setForm((p) => {
                          const breaks = [...p.breaks];
                          breaks[idx] = { ...breaks[idx], end_time };
                          return { ...p, breaks };
                        })
                      }
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={br.is_paid}
                      onChange={(e) =>
                        setForm((p) => {
                          const breaks = [...p.breaks];
                          breaks[idx] = { ...breaks[idx], is_paid: e.target.checked };
                          return { ...p, breaks };
                        })
                      }
                    />
                    Paid break
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={DASHBOARD_BTN_PRIMARY}
              >
                {saving ? (
                  <>
                    <LottieLoader size="xs" />
                    Saving…
                  </>
                ) : editingId ? (
                  'Update template'
                ) : (
                  'Create template'
                )}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className={DASHBOARD_BTN_SECONDARY}>
                  Cancel edit
                </button>
              )}
            </div>
            {saveError ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="whitespace-pre-line">{saveError}</p>
              </div>
            ) : null}
          </div>
        </SettingsSection>

        <SettingsSection title="Saved templates" subtitle="Assign these on each employee’s week grid">
          {templates.length === 0 ? (
            <p className="text-sm text-gray-500">No templates yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {templates.map((t) => (
                <li key={t.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">
                      {normalizeTime(t.work_start_time)} – {normalizeTime(t.work_end_time)}
                      {(t.breaks || []).length > 0
                        ? ` · ${(t.breaks || []).length} break(s)`
                        : ''}
                      {t.assignment_count > 0 ? ` · ${t.assignment_count} assignment(s)` : ''}
                      {!t.is_active ? ' · inactive' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs font-medium text-[#007AFF]"
                      onClick={() => setEditingId(t.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-red-600"
                      disabled={deleting || forceDeleting}
                      onClick={() => setDeleteTarget({ template: t, force: false, error: null })}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SettingsSection>
      </SettingsContentGrid>

      <div className={`${SETTINGS_PANEL} px-4 py-3 text-xs text-gray-500`}>
        Deleting a template in use will ask to unassign it from all weekly schedules first.
      </div>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget?.force ? handleForceDelete() : handleDelete(deleteTarget.template)
        }
        title={deleteTarget?.force ? 'Unassign and delete template?' : 'Delete shift template?'}
        variant="destructive"
        confirmText={deleteTarget?.force ? 'Unassign & delete' : 'Delete template'}
        cancelText="Cancel"
        isLoading={deleting || forceDeleting}
      >
        <div className="space-y-3 text-sm text-gray-600">
          {deleteTarget?.force ? (
            <>
              <p>
                <strong>{deleteTarget.template?.name}</strong> is assigned on one or more employee
                weekly schedules. This will remove those assignments, then delete the template.
              </p>
              <p className="text-gray-500">Employees on that day will show as Off until reassigned.</p>
            </>
          ) : (
            <p>
              Delete <strong>{deleteTarget?.template?.name}</strong>? This cannot be undone.
            </p>
          )}
          {deleteTarget?.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 whitespace-pre-line">
              {deleteTarget.error}
            </div>
          ) : null}
        </div>
      </ConfirmationDialog>
    </div>
  );
};

export default ShiftTemplates;
