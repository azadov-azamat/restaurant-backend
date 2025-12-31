require('dotenv').config({});

const { Op, Sequelize } = require('sequelize');
const { AnalyticsEvent, User, sequelize } = require('../db/models');
const { Telegraf } = require('telegraf');
const logger = require('../server/utils/logger');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const updateMessages = {
  uz: `🏡 Yangi Uylar Guruhiga qo‘shiling! Sotiladigan uylar bir joyda! E’lon berish yoki uy topish uchun guruhga kiring: @toptoshkentuylari`,
  ru: `🏡 Присоединяйтесь к группе по недвижимости! Продажа домов и квартир в одном месте. Добавляйте объявления или находите жилье: @toptoshkentuylari`,
  uz_cyr: `🏡 Янги уйлар гуруҳига қўшилинг! Сотиладиган уйлар бир жойда! Эълон бериш ёки уй топиш учун гуруҳга киринг: @toptoshkentuylari`,
};

// Statistikani saqlash uchun global o‘zgaruvchilar
let stats = {
  userBlockedBot: 0,
  userDeactivatedBot: 0,
  chatNotFound: 0,
  userNotFound: 0,
  sent: 0,
  totalUsers: 0,
};

function printStats() {
  logger.info('📊 Statistika:');
  logger.info(`➡️ Jami foydalanuvchilar: ${stats.totalUsers}`);
  logger.info(`✅ Yuborilgan: ${stats.sent}`);
  logger.info(`⛔ Bloklaganlar: ${stats.userBlockedBot}`);
  logger.info(`🗑️ Deaktivatsiya qilinganlar: ${stats.userDeactivatedBot}`);
  logger.info(`❓ Chat topilmadi: ${stats.chatNotFound}`);
  logger.info(`🚫 Foydalanuvchi topilmadi: ${stats.userNotFound}`);
}

// Script to‘xtaganda statistikani chiqarish
process.on('exit', printStats);
process.on('SIGINT', () => {
  logger.info('\n❗ SIGINT (Ctrl+C) olindi. Dasturni to‘xtatish...');
  process.exit();
});
process.on('uncaughtException', err => {
  logger.error('❌ Kutilmagan xatolik:', err);
  process.exit(1);
});

async function getInactiveBotUserIds() {
  try {
    const inactiveUsers = await sequelize.query(
      `
            WITH active_bot_users AS (
                SELECT DISTINCT user_id
                FROM analytics_events
                WHERE platform = 'bot' 
                  AND created_at >= NOW() - INTERVAL '30 days'
            )
            SELECT DISTINCT user_id
            FROM analytics_events
            WHERE platform = 'bot' 
              AND user_id NOT IN (SELECT user_id FROM active_bot_users);
            `,
      { type: sequelize.QueryTypes.SELECT }
    );
    return inactiveUsers.map(user => user.user_id);
  } catch (err) {
    logger.error('Inactive user IDs olishda xatolik yuz berdi:', err);
    return [];
  }
}

async function getActiveUserIds() {
  try {
    // Foydalanuvchilarning faolligini aniqlash uchun query
    const activeUsers = await AnalyticsEvent.findAll({
      attributes: ['user_id'],
      where: {
        platform: 'bot',
        created_at: {
          [Op.gte]: Sequelize.literal("CURRENT_DATE - interval '30 days'"), // So‘nggi 30 kun ichidagi so‘rovlar
        },
      },
      group: ['user_id'], // Faqat unikal user_idlar
    });

    // Faqat user_idlarini qaytarish
    return activeUsers.map(user => user.user_id);
  } catch (err) {
    logger.error('Foydalanuvchilarni olishda xatolik yuz berdi:', err);
    return [];
  }
}

async function sendUpdateMessage(batchSize = 800, userIds) {
  stats.totalUsers = userIds.length;

  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    logger.info(`Sending batch ${i / batchSize + 1} of ${Math.ceil(userIds.length / batchSize)}`);

    const users = await User.findAll({
      where: { id: batch },
    });

    await Promise.all(
      users.map(async currentUser => {
        if (!currentUser) {
          stats.userNotFound++;
          return;
        }

        let language = currentUser.selectedLang || 'uz';
        let messageTemplate = updateMessages[language];

        try {
          await bot.telegram.sendMessage(currentUser.telegramId, messageTemplate);
          stats.sent++;
        } catch (err) {
          if (err.code === 403 && err.response.description.includes('user is deactivated')) {
            stats.userDeactivatedBot++;
          } else if (
            err.code === 403 &&
            err.response.description.includes('bot was blocked by the user')
          ) {
            stats.userBlockedBot++;
          } else {
            stats.chatNotFound++;
          }
        }
      })
    );

    logger.info(`⏳ Batch ${i / batchSize + 1} yakunlandi. 1 daqiqa kutamiz...`);
    await sleep(60000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const send = async () => {
  const userIds = await getInactiveBotUserIds();
  // const userIds = await getActiveUserIds();
  logger.info(`user.length ${userIds.length}`);
  await sendUpdateMessage(1200, userIds);
};

send()
  .then(() => {
    logger.info('✅ Barcha xabarlar yuborildi.');
    process.exit(0);
  })
  .catch(err => {
    logger.error('Xabarlarni yuborishda xatolik yuz berdi:', err);
    process.exit(1);
  });
