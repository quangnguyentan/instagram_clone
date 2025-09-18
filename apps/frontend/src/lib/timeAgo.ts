export function timeAgo(createdAt: Date | string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / 60 / 1000);
  const hours = Math.floor(diffMs / 60 / 60 / 1000);
  const days = Math.floor(diffMs / 60 / 60 / 24 / 1000);

  if (seconds < 60) return `${seconds} giây`;
  if (minutes < 60) return `${minutes} phút`;
  if (hours < 24) return `${hours} giờ`;
  return `${days} ngày`;
}
