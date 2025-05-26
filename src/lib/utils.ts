export function getImageUrl(imageName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  return `${baseUrl}/${imageName}`;
} 