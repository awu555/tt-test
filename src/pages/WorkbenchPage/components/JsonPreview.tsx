export function JsonPreview(props: { title: string; value: unknown }) {
  return (
    <div className="rounded-lg bg-white shadow-panel ring-1 ring-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold text-slate-900">{props.title}</div>
        <div className="text-[12px] text-slate-500">live</div>
      </div>
      <pre className="mt-3 overflow-auto rounded-md bg-slate-950 p-3 text-[12px] leading-5 text-slate-100">
        {JSON.stringify(props.value, null, 2)}
      </pre>
    </div>
  );
}

