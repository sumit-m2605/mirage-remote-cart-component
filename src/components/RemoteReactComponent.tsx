import { useEffect, useState } from 'react';
import './styles/style.css';

const RemoteReactComponent = ({ store, route, router }) => {
  /* local React state mirrors Vuex */
  const [count, setCount] = useState(store.state.counter.count);

  /* run once on mount */
  useEffect(() => {
    /* any change to counter.count triggers setCount → re-render */
    const unwatch = store.watch(
      s => s.counter.count,          // getter
      newVal => setCount(newVal)     // callback
    );

    /* cleanup */
    return unwatch;
  }, [store]);

  const increment = () => store.dispatch('counter/increment');

  const goToHome = () => {
    const id = route.params?.company_id;
    if (id) router.push(`/company/${id}/home/`);
  };

  return (
    <div className="remote-box">
      <div>👋 Hello from React Remote!</div>
      <p>🧮 Count: <strong>{count}</strong></p>
      <button onClick={increment}>+1</button>
      <p>📍 Path: {route.path}</p>
      <button onClick={goToHome}>Go to /home</button>
    </div>
  );
};

export default RemoteReactComponent;
