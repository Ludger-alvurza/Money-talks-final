import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("currencies").select("*");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request: Request) {
  const { name, code, value } = await request.json();
  const { data, error } = await supabase
    .from("currencies")
    .insert([{ name, code, value }]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data), { status: 201 });
}
