import React, { useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const CV_MAX_BYTES = 600 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

const ApplyJobPage = () => {
  const job = useLoaderData();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [otherUrl, setOtherUrl] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error('Please attach your CV.');
      return;
    }
    if (cvFile.size > CV_MAX_BYTES) {
      toast.error('CV file is too large. Please use a file under 600 KB for this demo.');
      return;
    }

    setSubmitting(true);
    try {
      const cvData = await readFileAsDataUrl(cvFile);
      const payload = {
        jobId: String(job.id),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        coverLetter: coverLetter.trim(),
        githubUrl: githubUrl.trim() ? normalizeUrl(githubUrl) : '',
        facebookUrl: facebookUrl.trim() ? normalizeUrl(facebookUrl) : '',
        linkedinUrl: linkedinUrl.trim() ? normalizeUrl(linkedinUrl) : '',
        otherUrl: otherUrl.trim() ? normalizeUrl(otherUrl) : '',
        cvFileName: cvFile.name,
        cvMimeType: cvFile.type || 'application/octet-stream',
        cvData,
        createdAt: new Date().toISOString(),
        fitAssessment: 'pending',
        employerNotes: '',
      };

      const res = await api.post('/api/applications', payload);

      if (!res.ok) throw new Error('Save failed');

      toast.success('Application submitted. Good luck!');
      navigate(`/jobs/${job.id}`, { replace: true });
    } catch {
      toast.error('Could not submit application. Is the API server running on port 7000?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-blue-50 min-h-screen py-10 px-6">
      <div className="container m-auto max-w-2xl">
        <Link to={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <FaArrowLeft className="mr-2" />
          Back to job
        </Link>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 md:p-8">
          <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-1">Apply for</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{job.title}</h1>
          <p className="text-gray-600 text-sm mb-8">
            Complete the form below. Your CV is stored with this demo API for employers to review alongside the job
            requirements.
          </p>

          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 font-bold mb-2">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="border rounded w-full py-2 px-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="border rounded w-full py-2 px-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="border rounded w-full py-2 px-3"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="coverLetter" className="block text-gray-700 font-bold mb-2">
                Cover letter / why you fit this role
              </label>
              <textarea
                id="coverLetter"
                rows={5}
                required
                className="border rounded w-full py-2 px-3"
                placeholder="Summarize your experience and how it matches the job description."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cv" className="block text-gray-700 font-bold mb-2">
                CV (PDF or document, max 600 KB)
              </label>
              <input
                id="cv"
                type="file"
                required
                accept=".pdf,.doc,.docx,application/pdf"
                className="border rounded w-full py-2 px-3 bg-gray-50"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Optional links</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="githubUrl" className="block text-gray-600 text-sm font-medium mb-1">
                    GitHub
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    className="border rounded w-full py-2 px-3"
                    placeholder="https://github.com/yourname"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="linkedinUrl" className="block text-gray-600 text-sm font-medium mb-1">
                    LinkedIn
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    className="border rounded w-full py-2 px-3"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="facebookUrl" className="block text-gray-600 text-sm font-medium mb-1">
                    Facebook or other profile
                  </label>
                  <input
                    id="facebookUrl"
                    type="url"
                    className="border rounded w-full py-2 px-3"
                    placeholder="https://..."
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="otherUrl" className="block text-gray-600 text-sm font-medium mb-1">
                    Portfolio or other link
                  </label>
                  <input
                    id="otherUrl"
                    type="url"
                    className="border rounded w-full py-2 px-3"
                    placeholder="https://..."
                    value={otherUrl}
                    onChange={(e) => setOtherUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplyJobPage;
