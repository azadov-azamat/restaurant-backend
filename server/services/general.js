async function createStaffWithMedia({ Staff, Media, sequelize }, payload) {
  return sequelize.transaction(async (t) => {
    const staff = await Staff.create(payload, { transaction: t });

    const media = await Media.create(
      { provider: 'local', ownerType: 'staff', ownerId: staff.id },
      { transaction: t }
    );

    await staff.update({ mediaId: media.id }, { transaction: t });

    return staff;
  });
}

// Helper function
function computeOrderStatus(items) {
  if (items.length === 0) return 'OPEN';

  const allDelivered = items.every(i => i.status === 'DELIVERED');
  if (allDelivered) return 'COMPLETED';

  const hasActiveItems = items.some(i => ['SENT', 'PREPARING', 'READY'].includes(i.status));
  if (hasActiveItems) return 'IN_PROGRESS';

  const allPending = items.every(i => i.status === 'PENDING');
  if (allPending) return 'OPEN';

  return 'IN_PROGRESS';
}

module.exports = { createStaffWithMedia, computeOrderStatus };

