export function estimateReadingMinutes(body: string): number {
  const cn = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const en = body.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const minutes = Math.ceil(cn / 400 + en / 200);
  return Math.max(1, minutes);
}
