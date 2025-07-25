import { useEffect, useState } from 'react';
import './styles/style.css';

const RemoteReactComponent = ({ store, route, router, saveProfile }) => {
  const [count, setCount] = useState(store?.state?.counter?.count ?? 0);
  const [profile, setProfile] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Keep count reactive
  useEffect(() => {
    const unwatch = store.watch(
      s => s.counter.count,
      newVal => setCount(newVal)
    );
    return unwatch;
  }, [store]);

  // Watch profile details
  useEffect(() => {
    const unwatch = store.watch(
      (_, getters) => getters['GET_COMPANY_PROFILE'],
      (newProfile) => {
        setProfile(newProfile);
        setUpdatedName(newProfile?.name ?? '');
      }
    );

    // initialize if already present
    const initial = store.getters?.['GET_COMPANY_PROFILE'];
    if (initial) {
      setProfile(initial);
      setUpdatedName(initial.name);
    }

    return unwatch;
  }, [store]);

  const increment = () => store.dispatch('counter/increment');

  const goToHome = () => {
    const id = route?.params?.company_id;
    if (id) router?.push(`/company/${id}/home/`);
  };

  const handleSave = async () => {
    if (!updatedName.trim() || updatedName === profile?.name) return;

    setLoading(true);
    setMessage('');
    try {
      await saveProfile({ name: updatedName.trim() });
      setMessage('✅ Saved!');
    } catch (e) {
      console.error('[Remote/React] Save failed:', e);
      setMessage('  Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="remote-box">
      <div>👋 Hello from React Remote!</div>

      <p>🧮 Counter from host store: <strong>{count}</strong></p>

      <button onClick={increment}>+1</button>
      
      <p>📍 Current route path: <strong>{route.path}</strong></p>

      <button onClick={goToHome}>Go to /home</button>

      {profile ? (
        <>
          <p>🏢 Company Name: <strong>{profile.name}</strong></p>

          <input
            className="input"
            value={updatedName}
            onChange={e => setUpdatedName(e.target.value)}
          />

          <button onClick={handleSave} disabled={loading || !updatedName.trim()}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          
          {message && <p className="message">{message}</p>}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default RemoteReactComponent;
