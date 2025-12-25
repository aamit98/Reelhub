// Generate avatar URL from username initials
export const generateAvatar = (username) => {
  const initials = username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Using UI Avatars service for simple avatar generation
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`;
};





