export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
