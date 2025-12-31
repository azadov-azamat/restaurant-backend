'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AnalyticsEvent extends Model {
    static associate({ Staff }) {
      AnalyticsEvent.belongsTo(Staff, {
        as: 'staff',
        foreignKey: 'staff_id',
      });
    }
  }

  AnalyticsEvent.init(
    {
      platform: {
        type: DataTypes.ENUM('web', 'bot', 'mobile'),
      },
      pageUrl: {
        type: DataTypes.STRING,
      },
      platformInfo: {
        type: DataTypes.STRING,
      },
      eventType: {
        type: DataTypes.STRING,
      },
      textMessage: {
        type: DataTypes.STRING,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      metadataHash: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'AnalyticsEvent',
      underscored: true,
    }
  );

  return AnalyticsEvent;
};

// eventTypes:
// accept-agreement
// accept-contact
// active-subscriptions
// add-new-ads
// agreement-showed
// alert_cargo_out_date
// alert_delete_load
// alert_delete_vehicle
// alert_vehicle_not_valid
// change-language
// change-truck-type
// confirm_cargo_out_date
// confirm_vehicle_not_valid
// delete_load_by_owner
// delete_vehicle_by_owner
// go_back_country
// help
// list-subscriptions
// location-search
// my-ads.my-loads
// my-ads.my-vehicles
// open_message_info
// page_view
// pre_checkout_query
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
// user_again_accepted_agreement
// vehicle_search
