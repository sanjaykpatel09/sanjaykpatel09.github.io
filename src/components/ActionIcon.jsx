const iconPaths = {
  copy: (
    <>
      <rect x="5.25" y="5.25" width="8.5" height="9" rx="1.25" />
      <path d="M10.75 5.25v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1.5" />
    </>
  ),
  download: <path d="M8 1.75v8m0 0 3-3m-3 3-3-3M2.25 10.5v2.25a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1V10.5" />,
  run: <path d="m5 3 8 5-8 5z" />,
  loading: (
    <>
      <path d="M14 8a6 6 0 1 1-1.76-4.24" />
      <path d="M14 2v4h-4" />
    </>
  ),
  compare: (
    <>
      <path d="M2.5 5h10m0 0-3-3m3 3-3 3" />
      <path d="M13.5 11h-10m0 0 3-3m-3 3 3 3" />
    </>
  ),
};

export default function ActionIcon({ name }) {
  return (
    <svg
      className={`action-icon${name === 'loading' ? ' action-icon-loading' : ''}`}
      aria-hidden="true"
      viewBox={name === 'copy' ? '0 0 16 16' : '0 0 16 16'}
    >
      {iconPaths[name]}
    </svg>
  );
}
