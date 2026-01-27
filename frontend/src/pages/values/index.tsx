import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { IValue, CreateValueDto, UpdateValueDto } from '@aws-cicd-monorepo/shared-types';
import { api, ApiError } from '@/lib/api';
import { Geist } from 'next/font/google';
import styles from '@/styles/Values.module.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

interface FormData {
  name: string;
  description: string;
}

export default function ValuesPage() {
  const [values, setValues] = useState<IValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchValues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.values.getAll();
      setValues(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to fetch values');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchValues();
  }, [fetchValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      if (editingId !== null) {
        const updateData: UpdateValueDto = {
          name: formData.name,
          description: formData.description || undefined,
        };
        await api.values.update(editingId, updateData);
      } else {
        const createData: CreateValueDto = {
          name: formData.name,
          description: formData.description || undefined,
        };
        await api.values.create(createData);
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      await fetchValues();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save value');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (value: IValue) => {
    setEditingId(value.id);
    setFormData({ name: value.name, description: value.description ?? '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this value?')) return;

    try {
      setError(null);
      await api.values.delete(id);
      await fetchValues();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete value');
    }
  };

  return (
    <>
      <Head>
        <title>Values - AWS CI/CD Monorepo</title>
        <meta name="description" content="Manage values in the application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable}`}>
        <main className={styles.main}>
          <div className={styles.header}>
            <Link href="/" className={styles.backLink}>
              &larr; Back to Home
            </Link>
            <h1>Values</h1>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{editingId !== null ? 'Edit Value' : 'Create New Value'}</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" disabled={submitting || !formData.name.trim()}>
                {submitting ? 'Saving...' : editingId !== null ? 'Update' : 'Create'}
              </button>
              {editingId !== null && (
                <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className={styles.list}>
            <h2>All Values</h2>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : values.length === 0 ? (
              <div className={styles.empty}>No values found. Create one above!</div>
            ) : (
              <ul>
                {values.map((value) => (
                  <li key={value.id} className={styles.listItem}>
                    <div className={styles.itemContent}>
                      <strong>{value.name}</strong>
                      {value.description && <p>{value.description}</p>}
                      <small>
                        Created: {new Date(value.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className={styles.itemActions}>
                      <button onClick={() => handleEdit(value)}>Edit</button>
                      <button
                        onClick={() => handleDelete(value.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
