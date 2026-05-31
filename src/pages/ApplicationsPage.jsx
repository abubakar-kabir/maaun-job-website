import React, { useEffect, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const FIT_OPTIONS = [
  { value: 'pending', label: 'Pending review' },
  { value: 'under_review', label: 'Under review' },
  { value: 'good_fit', label: 'Good fit for role' },
  { value: 'not_a_fit', label: 'Not a fit' },
];

function jobById(jobs, jobId) {
  return jobs.find((j) => String(j.id) === String(jobId));
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// eslint-disable-next-line react-refresh/only-export-components -- route loader
export async function applicationsLoader() {
  try {
    const [appsRes, jobsRes] = await Promise.all([api.get('/api/applications'), api.get('/api/jobs')]);
    const applications = appsRes.ok ? await appsRes.json() : [];
    const jobs = jobsRes.ok ? await jobsRes.json() : [];
    return {
      applications: Array.isArray(applications) ? applications : [],
      jobs: Array.isArray(jobs) ? jobs : [],
      loadError: !appsRes.ok || !jobsRes.ok,
    };
  } catch {
    return { applications: [], jobs: [], loadError: true };
  }
}

const ApplicationsPage = () => {
  const { applications: initialApps, jobs, loadError } = useLoaderData();
  const [applications, setApplications] = useState(initialApps);
  const [selectedId, setSelectedId] = useState(initialApps[0]?.id ?? null);
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(
    () => [...applications].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [applications]
  );

  useEffect(() => {
    if (sorted.length === 0) return;
    if (selectedId == null || !sorted.some((a) => String(a.id) === String(selectedId))) {
      setSelectedId(sorted[0].id);
    }
  }, [sorted, selectedId]);

  const selected =
    sorted.find((a) => String(a.id) === String(selectedId)) ?? sorted[0] ?? null;
  const selectedJob = selected ? jobById(jobs, selected.jobId) : null;

  const [notesDraft, setNotesDraft] = useState(selected?.employerNotes ?? '');
  const [fitDraft, setFitDraft] = useState(selected?.fitAssessment ?? 'pending');

  useEffect(() => {
    const app = sorted.find((a) => String(a.id) === String(selectedId));
    if (!app) return;
    setNotesDraft(app.employerNotes ?? '');
    setFitDraft(app.fitAssessment ?? 'pending');
  }, [selectedId, sorted]);

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    const updated = {
      ...selected,
      employerNotes: notesDraft,
      fitAssessment: fitDraft,
    };
    try {
      const res = await api.put(`/api/applications/${selected.id}`, updated);
      if (!res.ok) throw new Error('Failed');
      setApplications((prev) =>
        prev.map((a) => (String(a.id) === String(selected.id) ? updated : a))
      );
      toast.success('Review saved');
    } catch {
      toast.error('Could not save. Check that json-server is running.');
    } finally {
      setSaving(false);
    }
  };

  const badgeClass = (fit) => {
    switch (fit) {
      case 'good_fit':
        return 'bg-green-100 text-green-800';
      case 'not_a_fit':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-amber-100 text-amber-900';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="bg-blue-50 min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-600 mb-6">
          Review submissions against each job&apos;s requirements and record whether the candidate is a good fit.
        </p>

        {loadError && (
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm">
            Could not load data from the API. Start the server with{' '}
            <code className="bg-amber-100 px-1 rounded">npm run server</code> (port 7000) and refresh.
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">No applications yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              {sorted.map((app) => {
                const j = jobById(jobs, app.jobId);
                const active = selected && String(app.id) === String(selected.id);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedId(app.id)}
                    className={`w-full text-left rounded-lg border p-4 transition ${
                      active ? 'border-blue-600 bg-white shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{app.fullName}</div>
                    <div className="text-sm text-gray-600 truncate">{app.email}</div>
                    <div className="text-xs text-blue-700 mt-1 font-medium">{j?.title ?? `Job #${app.jobId}`}</div>
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${badgeClass(app.fitAssessment)}`}>
                      {FIT_OPTIONS.find((o) => o.value === app.fitAssessment)?.label ?? app.fitAssessment}
                    </span>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Candidate</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Name</dt>
                      <dd className="font-medium text-gray-900">{selected.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Submitted</dt>
                      <dd className="font-medium text-gray-900">{formatDate(selected.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Email</dt>
                      <dd>
                        <a className="text-blue-600 hover:underline" href={`mailto:${selected.email}`}>
                          {selected.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Phone</dt>
                      <dd>
                        <a className="text-blue-600 hover:underline" href={`tel:${selected.phone}`}>
                          {selected.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.githubUrl && (
                      <a
                        href={selected.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        GitHub
                      </a>
                    )}
                    {selected.linkedinUrl && (
                      <a
                        href={selected.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        LinkedIn
                      </a>
                    )}
                    {selected.facebookUrl && (
                      <a
                        href={selected.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        Profile
                      </a>
                    )}
                    {selected.otherUrl && (
                      <a
                        href={selected.otherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        Other link
                      </a>
                    )}
                    {selected.cvData && (
                      <a
                        href={selected.cvData}
                        download={selected.cvFileName || 'cv'}
                        className="text-sm px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium"
                      >
                        Download CV
                      </a>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Cover letter / summary</h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm bg-gray-50 rounded-lg p-4 border border-gray-100">
                      {selected.coverLetter || '—'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Job requirements (for comparison)</h2>
                  {selectedJob ? (
                    <>
                      <h3 className="text-lg font-semibold text-blue-800">{selectedJob.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedJob.type} · {selectedJob.location} · {selectedJob.salary}
                      </p>
                      <p className="text-gray-800 mt-4 whitespace-pre-wrap text-sm">{selectedJob.description}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">This job listing may have been removed (ID: {selected.jobId}).</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Your review</h2>
                  <label htmlFor="fitAssessment" className="block text-sm font-medium text-gray-700 mb-2">
                    Fit for this role
                  </label>
                  <select
                    id="fitAssessment"
                    className="border rounded w-full py-2 px-3 mb-4 max-w-md"
                    value={fitDraft}
                    onChange={(e) => setFitDraft(e.target.value)}
                  >
                    {FIT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="employerNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (requirements checklist, interview feedback, etc.)
                  </label>
                  <textarea
                    id="employerNotes"
                    rows={5}
                    className="border rounded w-full py-2 px-3 mb-4"
                    placeholder="e.g. Meets PhD requirement; strong React experience; follow up next week."
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={saveReview}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    {saving ? 'Saving…' : 'Save review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationsPage;
