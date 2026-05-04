import { useState } from 'react';
import type { Song } from '../types';

interface Props {
  song: Song | null;
  onSave: (data: Partial<Song>) => void;
  onCancel: () => void;
}

export default function ProductForm({ song, onSave, onCancel }: Props) {
  // TODO: Add one useState per field in your Product type. When editing, seed
  // each state value from `product` so the form is pre-populated.
  //
  // Example:
  // const [title, setTitle] = useState(product?.title ?? '');
  // const [rating, setRating] = useState(product?.rating ?? 0);
  const [title, setTitle] = useState(song?.title ?? '');
  const [artist, setArtist] = useState(song?.artist ?? '');
  const [album, setAlbum] = useState(song?.album ?? '');
  const [key, setKey] = useState(song?.key ?? '');
  const [length, setLength] = useState(song?.length ?? '');


  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // TODO: Validate required fields, then call onSave with them.
    //
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!artist.trim()) {
      setError('Artist is required');
      return;
    }
    if (!album.trim()) {
      setError('Album name is required');
      return;
    }
    if (!key.trim()) {
      setError('Key is required');
      return;
    }
    if (!length.trim()) {
      setError('Length is required');
      return;
    }
    onSave({title, artist, album, key, length});

    //onSave({});
  }

  return (
    <div>
      <h2>{song ? 'Edit Item' : 'Add New Item'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        {/* TODO: Add one labeled <input> per field.*/}
        <label>
          Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
        </label>

        <label>
          Artist
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
        </label>
        
        <label>
          Album
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              required
            />
        </label>

        <label>
          Key
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
        </label>

        <label>
          Length (mm:ss format)
            <input
              type="text"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              required
            />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="primary" type="submit">
            {song ? 'Save Changes' : 'Add Item'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
