export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/assignments/${id}/regenerate`,
    { method: 'POST' }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}