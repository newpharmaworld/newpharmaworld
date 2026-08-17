/**
 * Formats a WhatsApp URL with an optional prefilled message
 */
export function getWhatsAppUrl(whatsappNumber: string, message?: string): string {
  // Clean phone number to digits only
  const cleanNumber = (whatsappNumber || '').replace(/\D/g, '');
  const targetNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
  
  if (!message) {
    return `https://wa.me/${targetNumber}`;
  }
  
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a default product enquiry message for WhatsApp
 */
export function getProductWhatsAppMessage(productName: string, genericName?: string): string {
  if (genericName) {
    return `Hello New Pharma World, I would like to enquire about ${productName} (${genericName}).`;
  }
  return `Hello New Pharma World, I would like to enquire about ${productName}.`;
}

/**
 * Formats a phone number for tel: links
 */
export function getTelUrl(phone: string): string {
  const clean = (phone || '').replace(/[^\d+]/g, '');
  return `tel:${clean}`;
}

/**
 * Formats ISO date string to a human readable format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Truncates text with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
