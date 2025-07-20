export async function uploadToCloudinary(file: File): Promise<string> {
  const url = 'https://api.cloudinary.com/v1_1/dkea2wm45/upload';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_clubsync');
  formData.append('folder', 'clubsync/club-requests');
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
} 