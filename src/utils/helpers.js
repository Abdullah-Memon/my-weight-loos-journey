export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const downloadJSON = (data, filename) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const showNotification = (title, body, type = 'info') => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/icons/icon-192x192.png'
    });
  }

  // Custom notification for UI feedback
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm fade-in ${
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
    type === 'warning' ? 'bg-yellow-600' :
    'bg-blue-600'
  }`;
  notification.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-90">${body}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' };
  if (bmi < 25) return { category: 'Normal', color: 'text-green-400' };
  if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
  return { category: 'Obese', color: 'text-red-400' };
};