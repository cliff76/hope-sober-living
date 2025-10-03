export function getRandomInteger(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDate(value: string | Date): string {
    let d: Date;

    if (typeof value === "string") {
        // Handle YYYY-MM-DD safely (local time, no UTC shift)
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (match) {
            const [, year, month, day] = match.map(Number);
            d = new Date(year, month - 1, day);
        } else {
            // Fallback: let JS parse non-ISO formats
            d = new Date(value);
        }
    } else {
        d = value;
    }

    if (isNaN(d.getTime())) return String(value);

    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}