export function PageState({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <div className="page-state">
        <span className="spinner" aria-hidden="true" />
        Conectando con el servidor… (puede tardar unos segundos)
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-state error">
        <p>{error}</p>
        <button className="btn" onClick={onRetry}>Reintentar</button>
      </div>
    );
  }
  return children;
}
