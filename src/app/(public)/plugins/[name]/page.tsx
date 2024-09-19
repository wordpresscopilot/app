export default function PluginPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  return <div>Plugin Page: {decodedName}</div>;
}
