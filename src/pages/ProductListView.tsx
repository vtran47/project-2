import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Song } from '../types';
import ProductForm from '../components/ProductForm';

interface Props {
  user: User | null;
}

export default function SongsListView({ user }: Props) {
  const [products, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Song | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    setLoading(true);
    setError(null);

    // TODO: Replace 'products' with your actual table name, and replace
    // Product with your type. Order however makes sense for your data.
    //
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) setError(error.message);
    else setSongs(data ?? []);

    setLoading(false);
  }

  async function handleAdd(data: Partial<Song>) {
    if (!user) return;

    // TODO: Insert into your table. Remember to include user_id so your
    // RLS policy can check ownership on later updates/deletes.
    //s
    const { error } = await supabase
      .from('songs')
      .insert([{ ...data, user_id: user.id }]);
    
    if (error) { alert(error.message); return; }
    setShowForm(false);
    fetchSongs();

    console.log('Add:', data);
  }

  async function handleEdit(data: Partial<Song>) {
    if (!editing) return;

    // TODO: Update the row by id.
    //
    const { error } = await supabase
      .from('songs')
      .update(data)
      .eq('id', editing.id);
    
    if (error) { alert(error.message); return; }
    setEditing(null);
    fetchSongs();

    console.log('Edit:', editing.id, data);
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;

    // TODO: Delete the row by id.
    //
    const { error } = await supabase.from('songs').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    fetchSongs();

    console.log('Delete:', id);
  }

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p className="error">Failed to load: {error}</p>;

  if (showForm || editing) {
    return (
      <ProductForm
        song={editing}
        onSave={editing ? handleEdit : handleAdd}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ flex: 1 }}>Songs</h1>
        {/* Only signed-in users see the Add button. RLS enforces the real rule
            at the database level — this UI check just hides the affordance. */}
        {user && (
          <button className="primary" onClick={() => setShowForm(true)}>
            + Add New
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          No songs yet. {user ? 'Click “Add New” to create one.' : 'Sign in to add the first one.'}
        </p>
      ) : (
        products.map((p) => (
          <div key={p.id} className="card">
            {/* TODO: Render all of your fields here.
                Example:
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <p>Platform: {p.platform} · Rating: {p.rating}/10</p>
            */}
            <h3>{p.title}</h3>
            <p>{p.artist}</p>
            <p>{p.album}</p>
            <p>Key: {p.key}</p>
            <p>Length: {p.length}</p>
            <p>Song #{p.id}</p>

            {user && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
