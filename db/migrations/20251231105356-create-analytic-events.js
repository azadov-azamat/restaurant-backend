'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query(`
    //   CREATE TYPE "platform_enum" AS ENUM ('web', 'bot');
    // `);

    await queryInterface.createTable('analytics_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      staff_id: {
        type: Sequelize.UUID,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      page_url: {
        type: Sequelize.STRING,
      },
      event_type: {
        type: Sequelize.STRING,
      },
      text_message: {
        type: Sequelize.STRING,
      },
      platform: {
        type: Sequelize.ENUM('web', 'bot'),
      },
      platform_info: {
        type: Sequelize.STRING,
      },
      metadata: {
        type: Sequelize.JSONB,
      },
      metadata_hash: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('analytics_events');
    await queryInterface.sequelize.query('DROP TYPE "platform_enum";');
  },
};

// EVENT TYPES
// change-language
// change-truck-type
// click_on_top_five_searches
// confirm_cargo_out_date
// confirm_vehicle_not_valid
// create_new_load
// create_new_vehicle
// delete_load_by_owner
// delete_vehicle_by_owner
// edit_load
// edit_vehicle
// go_back_country
// help
// latest_ads_row_click
// list-subscriptions
// load_search
// location-search
// main_page_input_search
// my-ads.my-loads
// my-ads.my-vehicles
// open_message_info
// page_view
// pre_checkout_query
// reload_latest_ads
// remove_add
// search_by
// search_by_parent
// search_for
// selected_city
// selected_country
// selected_subscription
// set-truck-type
// share-contact
// share-contact-agreement-btn
// share-contact-agreement-inline-btn
// share-contact-auth
// show_ad_phone
// show_message_link
// show_more
// start
// subscriptions
// successful_payment
// unarchive_ad
// user_again_accepted_agreement
// vehicle_search
