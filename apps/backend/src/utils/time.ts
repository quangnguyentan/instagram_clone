export const parseExpireToMs = (expire: string | undefined, fallbackMs: number): number => {
    if (!expire) return fallbackMs;
    const match = expire.match(/^(\d+)([smhd])$/); // ví dụ: 7d, 30m
    if (!match) return fallbackMs;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const unitMap: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return value * unitMap[unit];
};
