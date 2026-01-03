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

module.exports = { createStaffWithMedia };

