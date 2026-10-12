import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css';
import { createAdminProject, fetchAdminAccount, updateAdminAccount } from '../services/api';

type AccountFormData = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  profileImageUrl: string;
};

type ProjectFormData = {
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  featuredSlot: string;
  technologies: string;
  projectUrl: string;
  repositoryUrl: string;
  media: string;
};

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  status: 'ongoing',
  startDate: '',
  endDate: '',
  featuredSlot: '',
  technologies: '',
  projectUrl: '',
  repositoryUrl: '',
  media: '',
};

const initialAccountFormData: AccountFormData = {
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  profileImageUrl: '',
};

function parseList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [accountFormData, setAccountFormData] = useState<AccountFormData>(initialAccountFormData);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccessMessage, setAccountSuccessMessage] = useState<string | null>(null);

  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const accountDisplayName = useMemo(() => {
    const fullName = `${accountFormData.firstName} ${accountFormData.lastName}`.trim();
    return accountFormData.displayName.trim() || fullName || 'Admin';
  }, [accountFormData.displayName, accountFormData.firstName, accountFormData.lastName]);

  useEffect(() => {
    let isMounted = true;

    async function loadAccount() {
      setIsLoadingAccount(true);
      setAccountError(null);

      try {
        const account = await fetchAdminAccount();

        if (!isMounted) {
          return;
        }

        setAccountFormData({
          firstName: account.firstName || '',
          lastName: account.lastName || '',
          displayName: account.displayName || '',
          email: account.email || '',
          profileImageUrl: account.profileImageUrl || '',
        });
      } catch (apiError: any) {
        if (!isMounted) {
          return;
        }

        if (apiError && apiError.message) {
          setAccountError(apiError.message);
        } else {
          setAccountError('Unable to load your account details right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingAccount(false);
        }
      }
    }

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleAccountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setAccountFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'status' && value === 'ongoing' ? { endDate: '' } : {}),
    }));
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    navigate('/login');
  }

  async function handleAccountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingAccount(true);
    setAccountError(null);
    setAccountSuccessMessage(null);

    try {
      const updatedAccount = await updateAdminAccount({
        firstName: accountFormData.firstName.trim(),
        lastName: accountFormData.lastName.trim(),
        displayName: accountFormData.displayName.trim(),
        email: accountFormData.email.trim(),
        profileImageUrl: accountFormData.profileImageUrl.trim(),
      });

      setAccountFormData({
        firstName: updatedAccount.firstName || '',
        lastName: updatedAccount.lastName || '',
        displayName: updatedAccount.displayName || '',
        email: updatedAccount.email || '',
        profileImageUrl: updatedAccount.profileImageUrl || '',
      });

      setAccountSuccessMessage('Account details saved successfully.');
    } catch (apiError: any) {
      if (apiError && apiError.message) {
        setAccountError(apiError.message);
      } else {
        setAccountError('Unable to save your account details right now.');
      }
    } finally {
      setIsSavingAccount(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.status === 'completed' ? formData.endDate : undefined,
        featuredSlot: formData.featuredSlot === '' ? null : Number(formData.featuredSlot),
        technologies: parseList(formData.technologies),
        projectUrl: formData.projectUrl.trim() || undefined,
        repositoryUrl: formData.repositoryUrl.trim() || undefined,
        media: parseList(formData.media),
      };

      await createAdminProject(payload);
      setSuccessMessage('Project saved. The form now includes homepage slot selection.');
      setFormData(initialFormData);
    } catch (apiError: any) {
      if (apiError && apiError.message) {
        setError(apiError.message);
      } else {
        setError('Unable to save the project right now.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <section className="admin-panel admin-form-panel">
          <button
            type="button"
            className="admin-section-toggle"
            onClick={() => setIsAccountOpen((previous) => !previous)}
            aria-expanded={isAccountOpen}
            title={isAccountOpen ? 'Click to collapse' : 'Click to expand'}
          >
            <span className="admin-section-label">Account</span>
            <span className="admin-section-toggle-title">Account</span>
            <span className="admin-section-toggle-hint">
              {isAccountOpen ? 'Click to collapse' : 'Click to expand'}
            </span>
          </button>

          <div
            className={`admin-collapsible-content ${
              isAccountOpen
                ? 'admin-collapsible-content--open'
                : 'admin-collapsible-content--closed'
            }`}
            aria-hidden={!isAccountOpen}
          >
            <div className="admin-panel-heading">
              <div>
                <span className="admin-section-label">Account</span>
                <h2>Profile & identity</h2>
              </div>
            </div>

            <div className="admin-account-layout">
              <aside className="admin-account-card">
                <div className="admin-avatar-frame">
                  {accountFormData.profileImageUrl ? (
                    <img
                      src={accountFormData.profileImageUrl}
                      alt={accountDisplayName}
                      className="admin-avatar-image"
                    />
                  ) : (
                    <span className="admin-avatar-fallback" aria-hidden="true">
                      {accountDisplayName.charAt(0).toUpperCase() || 'A'}
                    </span>
                  )}
                </div>

                <h3>{accountDisplayName}</h3>
                <p>{accountFormData.email || 'No email set yet'}</p>
                <span className="admin-role-badge">Admin account</span>
              </aside>

              <form className="admin-project-form" onSubmit={handleAccountSubmit}>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={accountFormData.firstName}
                      onChange={handleAccountChange}
                      required
                      disabled={isLoadingAccount || isSavingAccount}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={accountFormData.lastName}
                      onChange={handleAccountChange}
                      required
                      disabled={isLoadingAccount || isSavingAccount}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="displayName">Display name</label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={accountFormData.displayName}
                      onChange={handleAccountChange}
                      placeholder="How you want your name to appear"
                      disabled={isLoadingAccount || isSavingAccount}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="email">Registered email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={accountFormData.email}
                      onChange={handleAccountChange}
                      required
                      disabled={isLoadingAccount || isSavingAccount}
                    />
                  </div>

                  <div className="admin-field admin-field--full">
                    <label htmlFor="profileImageUrl">Profile image URL</label>
                    <input
                      id="profileImageUrl"
                      name="profileImageUrl"
                      type="url"
                      value={accountFormData.profileImageUrl}
                      onChange={handleAccountChange}
                      placeholder="https://example.com/profile-photo.jpg"
                      disabled={isLoadingAccount || isSavingAccount}
                    />
                    <span className="admin-field-hint">
                      Add the image URL you want to use for your profile picture.
                    </span>
                  </div>
                </div>

                {(accountError || accountSuccessMessage) && (
                  <div
                    className={`admin-form-message ${
                      accountError ? 'admin-form-message--error' : 'admin-form-message--success'
                    }`}
                    role={accountError ? 'alert' : 'status'}
                  >
                    {accountError || accountSuccessMessage}
                  </div>
                )}

                <div className="admin-form-actions admin-form-actions--split">
                  <button type="submit" disabled={isLoadingAccount || isSavingAccount}>
                    {isLoadingAccount
                      ? 'Loading account...'
                      : isSavingAccount
                        ? 'Saving account...'
                        : 'Save Account'}
                  </button>

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={handleLogout}
                    disabled={isSavingAccount}
                  >
                    Log out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="admin-panel admin-form-panel">
          <button
            type="button"
            className="admin-section-toggle"
            onClick={() => setIsProjectOpen((previous) => !previous)}
            aria-expanded={isProjectOpen}
            title={isProjectOpen ? 'Click to collapse' : 'Click to expand'}
          >
            <span className="admin-section-label">Projects</span>
            <span className="admin-section-toggle-title">Projects</span>
            <span className="admin-section-toggle-hint">
              {isProjectOpen ? 'Click to collapse' : 'Click to expand'}
            </span>
          </button>

          <div
            className={`admin-collapsible-content ${
              isProjectOpen
                ? 'admin-collapsible-content--open'
                : 'admin-collapsible-content--closed'
            }`}
            aria-hidden={!isProjectOpen}
          >
            <div className="admin-panel-heading">
              <div>
                <span className="admin-section-label">Project editor</span>
                <h2>Add a New Project</h2>
              </div>
            </div>

            <form className="admin-project-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-field admin-field--full">
                  <label htmlFor="title">Project title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field admin-field--full">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label htmlFor="startDate">Start date</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="endDate">End date</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.status !== 'completed'}
                    required={formData.status === 'completed'}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="featuredSlot">Homepage slot</label>
                  <select
                    id="featuredSlot"
                    name="featuredSlot"
                    value={formData.featuredSlot}
                    onChange={handleChange}
                  >
                    <option value="">No slot</option>
                    <option value="1">Slot 1</option>
                    <option value="2">Slot 2</option>
                    <option value="3">Slot 3</option>
                  </select>
                </div>

                <div className="admin-field admin-field--full">
                  <label htmlFor="technologies">Technologies</label>
                  <textarea
                    id="technologies"
                    name="technologies"
                    rows={3}
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, Tailwind CSS"
                  />
                  <span className="admin-field-hint">
                    Separate items with commas or new lines.
                  </span>
                </div>

                <div className="admin-field">
                  <label htmlFor="projectUrl">Project URL</label>
                  <input
                    id="projectUrl"
                    name="projectUrl"
                    type="url"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    placeholder="https://your-project.com"
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="repositoryUrl">Repository URL</label>
                  <input
                    id="repositoryUrl"
                    name="repositoryUrl"
                    type="url"
                    value={formData.repositoryUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/your-repo"
                  />
                </div>

                <div className="admin-field admin-field--full">
                  <label htmlFor="media">Media URLs</label>
                  <textarea
                    id="media"
                    name="media"
                    rows={4}
                    value={formData.media}
                    onChange={handleChange}
                    placeholder="https://example.com/screenshot-1.png"
                  />
                  <span className="admin-field-hint">
                    Add one or more image URLs for this project.
                  </span>
                </div>
              </div>

              {(error || successMessage) && (
                <div
                  className={`admin-form-message ${
                    error ? 'admin-form-message--error' : 'admin-form-message--success'
                  }`}
                >
                  {error || successMessage}
                </div>
              )}

              <div className="admin-form-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving project...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;