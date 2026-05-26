export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.BACKEND_URL}/api/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/assignments`);
  const data = await res.json();
  return Response.json(data);
}
