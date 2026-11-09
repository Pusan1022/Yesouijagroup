// 숙소 스케줄 전용 iCal 중계 (Netlify Function)
const ALLOWED = ['airbnb.co.kr', 'airbnb.com', 'booking.com', 'agoda.com', 'vrbo.com'];
const CORS = { 'access-control-allow-origin': '*' };

export default async (req) => {
  const target = new URL(req.url).searchParams.get('url');
  if (!target) return new Response('missing url', { status: 400, headers: CORS });
  let host;
  try { host = new URL(target).hostname; } catch { return new Response('bad url', { status: 400, headers: CORS }); }
  if (!ALLOWED.some(d => host === d || host.endsWith('.' + d))) {
    return new Response('not allowed', { status: 403, headers: CORS });
  }
  const r = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return new Response(await r.text(), {
    status: r.status,
    headers: { ...CORS, 'content-type': 'text/calendar; charset=utf-8' },
  });
};
