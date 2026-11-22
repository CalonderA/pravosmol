// Минимальный cn без внешних зависимостей — объединяет классы, отбрасывая falsy.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
