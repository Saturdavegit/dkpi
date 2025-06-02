export function getImageUrl(imageName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  return `${baseUrl}/${imageName}`;
}

export function getProductImageUrl(imageName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  if (!baseUrl) {
    console.error('NEXT_PUBLIC_IMAGE_BASE_URL is not defined');
    return '/kefir.jpeg'; // Fallback image
  }
  // S'assurer que l'URL de base se termine par un /
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBaseUrl}${imageName}`;
} 