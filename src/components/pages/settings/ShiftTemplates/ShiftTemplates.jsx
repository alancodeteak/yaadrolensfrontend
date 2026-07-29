import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
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
  const perEmployee = settings?.shift_schedule_mode === 'per_employee';

  useEffect(() => {
    if (isLoading || perEmployee) return;
    const key = 'lens-toast-shifts-same-for-all';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    dashboardToast.info(
      'You can still create templates here. Enable Per employee under Attendance rules to assign Mon–Sun schedules.',
      'Shift mode: same for all'
    );
  }, [isLoading, perEmployee]);

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

  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm());
    setSaveError(null);
  }, []);

  const finishDeleteSuccess = useCallback(
    (template, message) => {
      dashboardToast.dismissConfirm();
      dashboardToast.success(message);
      if (editingId === template.id) resetForm();
      refetch();
    },
    [editingId, refetch, resetForm]
  );

  const runSafeDelete = useCallback(
    async (template) => {
      const count = template.assignment_count || 0;
      if (count > 0) {
        await unassignAndDelete(template.id).unwrap();
        finishDeleteSuccess(
          template,
          `Removed from ${count} assignment(s) and deleted “${template.name}”`
        );
        return;
      }

      try {
        await deleteTemplate(template.id).unwrap();
        finishDeleteSuccess(template, 'Template deleted');
      } catch (err) {
        const message = getApiErrorMessage(err, 'Could not delete template');
        if (err?.status === 409 || message.toLowerCase().includes('assigned')) {
          await unassignAndDelete(template.id).unwrap();
          finishDeleteSuccess(
            template,
            `Removed employee assignments and deleted “${template.name}”`
          );
          return;
        }
        dashboardToast.error(message, 'Delete failed');
        throw err;
      }
    },
    [deleteTemplate, finishDeleteSuccess, unassignAndDelete]
  );

  const runForceDelete = useCallback(
    async (template) => {
      await unassignAndDelete(template.id).unwrap();
      finishDeleteSuccess(
        template,
        `Force deleted “${template.name}” (assignments cleared)`
      );
    },
    [finishDeleteSuccess, unassignAndDelete]
  );

  const openForceDeleteConfirm = useCallback(
    (template) => {
      dashboardToast.confirm({
        variant: 'error',
        title: 'Force delete this shift?',
        message:
          `Emergency delete for “${template.name}”. This immediately clears every employee weekly assignment using this shift, then deletes the template. This cannot be undone.`,
        actions: [
          {
            key: 'cancel',
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => {},
          },
          {
            key: 'force',
            label: 'Force delete',
            variant: 'destructive',
            loadingText: 'Force deleting…',
            onClick: async () => {
              try {
                await runForceDelete(template);
              } catch (err) {
                dashboardToast.error(
                  getApiErrorMessage(err, 'Could not force-delete template'),
                  'Force delete failed'
                );
                throw err;
              }
            },
          },
        ],
      });
    },
    [runForceDelete]
  );

  const openDeleteConfirm = useCallback(
    (template) => {
      const count = template.assignment_count || 0;
      const hasAssignments = count > 0;

      dashboardToast.confirm({
        variant: 'warning',
        title: hasAssignments
          ? 'Remove from employees, then delete?'
          : 'Delete shift template?',
        message: hasAssignments
          ? `“${template.name}” is used on ${count} employee weekly assignment${count === 1 ? '' : 's'}.\n\n1) Remove this shift from those employee days\n2) Delete the template\n\nThose days will show as Off until reassigned.`
          : `Delete “${template.name}”? This template is not assigned to any employee week days. This cannot be undone.`,
        actions: [
          {
            key: 'cancel',
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => {},
          },
          {
            key: 'force',
            label: 'Force delete',
            variant: 'secondary',
            closeOnClick: true,
            onClick: () => {
              window.setTimeout(() => openForceDeleteConfirm(template), 120);
            },
          },
          {
            key: 'delete',
            label: hasAssignments ? 'Remove & delete' : 'Delete template',
            variant: 'destructive',
            loadingText: 'Deleting…',
            onClick: async () => {
              try {
                await runSafeDelete(template);
              } catch (err) {
                dashboardToast.error(
                  getApiErrorMessage(err, 'Could not delete template'),
                  'Delete failed'
                );
                throw err;
              }
            },
          },
        ],
      });
    },
    [openForceDeleteConfirm, runSafeDelete]
  );

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
                      onClick={() => openDeleteConfirm(t)}
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
        Deleting a template removes it from every employee weekly schedule first, then deletes it.
        Use force delete only in an emergency.
      </div>
    </div>
  );
};

export default ShiftTemplates;
