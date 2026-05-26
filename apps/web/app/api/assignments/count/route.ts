export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/assignments/count`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return Response.json(data);
}