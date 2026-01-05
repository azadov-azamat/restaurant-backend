/**
 * Order status ga qarab order qaysi holatda ekanini hisoblab beradi
 * @param {Array} orderItems - Order ga tegishli barcha items
 * @returns {String} - 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
 */
function computeOrderStatus(orderItems) {
  // Agar item lar yo'q bo'lsa
  if (!orderItems || orderItems.length === 0) {
    return 'OPEN';
  }

  // Barcha delivered bo'lsa
  const allDelivered = orderItems.every(item => item.status === 'DELIVERED');
  if (allDelivered) {
    return 'COMPLETED';
  }

  // Kamida bitta SENT, PREPARING, yoki READY bo'lsa
  const hasActiveItems = orderItems.some(item =>
    ['SENT', 'PREPARING', 'READY'].includes(item.status)
  );
  if (hasActiveItems) {
    return 'IN_PROGRESS';
  }

  // Hamma PENDING bo'lsa
  const allPending = orderItems.every(item => item.status === 'PENDING');
  if (allPending) {
    return 'OPEN';
  }

  // Default - IN_PROGRESS
  return 'IN_PROGRESS';
}

module.exports = { computeOrderStatus };
