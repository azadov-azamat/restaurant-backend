const createQueue = require('./utils/create-queue');
const { User, Ledger, Category, AiInsight, Op, Expense } = require('../../db/models');
const { Telegraf } = require('telegraf');
const dayjs = require('dayjs');
const debug = require('debug')('worker:oqim');
const error = require('debug')('worker:oqim:error');

const { defaultMessages } = require('../bot-app/utils/constants');
const { getRandomItem } = require('../bot-app/utils/general');
const logger = require('../utils/logger');
const { getLast24hExpensesFeedback } = require('../bot-app/services/openai');
const { trackAiInsight } = require('../bot-app/utils/analytics');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// -------------------- helpers --------------------
function isAllowedTime(key) {
  const hour = dayjs().hour();
  logger.info(`Current hour is ${hour}, checking allowed time for maintenance task ${key}`);
  return !(hour >= 1 && hour < 7);
}

async function send(user, key) {
  if (!user.telegramId) return;

  const lang = user.selectedLang || 'uz';
  const messages = defaultMessages.find(m => m.category === key)?.[lang];
  if (!messages?.length) return;

  const message = getRandomItem(messages);

  logger.info("message sending to " + user.id + " while " + message);
  await bot.telegram.sendMessage(
    user.telegramId,
    getRandomItem(messages)
  );
}

async function safeSendMessage(user, sendFn) {
  try {
    await sendFn();
  } catch (err) {
    if (err.code === 403 && err.response?.description?.includes('blocked')) {
      user.isBlocked = true;
    } else if (
      err.code === 403 &&
      err.response?.description?.includes('deactivated')
    ) {
      user.isDeactivated = true;
    } else if (
      err.code === 400 &&
      err.response?.description?.includes('chat not found')
    ) {
      user.isChatNotFound = true;
    }

    logger.error(`Telegram error userId=${user.id}: ${err.response?.description || err.message}`);

    await user.save();
  }
}

async function sendBatch(users, handler, batchSize = 30) {
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(user => handler(user))
    );
  }
}

async function processInBatches(items, handler, batchSize = 5) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(handler));
  }
}

// -------------------- JOB 1 --------------------
// ❌ 5 soat ledger yo‘q
async function notifyInactiveLedgerUsers() {
  if (!isAllowedTime('inactive_5h_users_reminder')) return;

  logger.info('Starting notifyInactiveLedgerUsers job');
  const fiveHoursAgo = dayjs().subtract(5, 'hour').toDate();

  const users = await User.findAll({
    where: { telegramId: { [Op.ne]: null }, isBlocked: false }
  });

  await sendBatch(users, async (user) => {
    const lastLedger = await Ledger.findOne({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      raw: true
    });

    if (!lastLedger || lastLedger.createdAt <= fiveHoursAgo) {
      await safeSendMessage(user, () =>
        send(user, 'inactive_5h_users_reminder')
      );
    }
  });

  logger.info("send all users: " + users.length + " inactive_5h_users_reminder")
}

// -------------------- JOB 2 --------------------
// 🆕 yangi user, ledger yo‘q
async function notifyNewUsersWithoutLedger() {
  if (!isAllowedTime('inactive_24h_users_reminder')) return;

  logger.info('Starting notifyNewUsersWithoutLedger job');
  const users = await User.findAll({
    where: { 
      telegramId: { [Op.ne]: null }, 
      isBlocked: false, 
      isBlockedByBot: false
   }
  });

  await sendBatch(users, async (user) => {
    const count = await Ledger.count({ where: { userId: user.id } });

    if (count === 0) {
      await safeSendMessage(user, () =>
        send(user, 'inactive_24h_users_reminder')
      );
    }
  });

  logger.info("send all users: " + users.length + " inactive_24h_users_reminder")
}

// -------------------- JOB 3 --------------------
// 📢 Story request (haftasiga 3 marta)
async function requestStoryFromUsers() {
  if (!isAllowedTime('story_mention_blessing')) return;

  logger.info('Starting requestStoryFromUsers job');
  const users = await User.findAll({
    where: { 
      telegramId: { [Op.ne]: null },
      isBlocked: false,
      isBlockedByBot: false,
    }
  });

  logger.info("users.length: " + users.length);
  await sendBatch(users, async (user) => {
    await safeSendMessage(user, () =>
      send(user, 'story_mention_blessing')
    );
  });

  logger.info("send all users: " + users.length + " story_mention_blessing")
}

async function daily24hInsightsJob() {
  const since = dayjs().subtract(26, 'hour').toDate();

  const users = await User.findAll({
    where: { 
      telegramId: { [Op.ne]: null },
      isBlocked: {
        [Op.or]: {
          [Op.ne]: true,
          [Op.is]: null
        }
      },
      isDeactivated: false,
      isBlockedByBot: false,
    },
    raw: false
  });

  await processInBatches(users, async (user) => {
    const lang = user.selectedLang || 'uz';

    try {
      const ledgers = await Ledger.findAll({
        where: {
          userId: user.id,
          type: 'out',
          date: { [Op.gte]: since }
        },
        include: [
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: Expense, as: 'expense', attributes: ['caption', 'details'] }
        ],
        order: [['date', 'DESC']],
      });

      if (!ledgers.length) return;

      const compact = compactExpenses(ledgers);

      const { message, id } =
        await getLast24hExpensesFeedback(compact, lang, user.id);

      await trackAiInsight(user, {
        responseId: id,
        advice: message,
      });

      await safeSendMessage(user, () =>
        bot.telegram.sendMessage(
          user.telegramId,
          message,
          {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          }
        )
      );

    } catch (e) {
      logger.error(
        `[daily24hInsightsJob] user=${user.id} error=${e.message}`
      );
    }
  });

  logger.info("send all users: " + users.length + " daily24hInsightsJob")
}

function compactExpenses(ledgers) {
  const currencySummary = {};
  const totalAmount = ledgers.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  
  const expenses = ledgers.map(l => {
    currencySummary[l.currency] =
      (currencySummary[l.currency] || 0) + Number(l.amount);

    return {
      category: l.category?.name || l.category,
      amount: Number(l.amount),
      currency: l.currency,
      caption: l.expense?.caption || '',
      time: l.date,
      reason: l.description || null,
      type: l.type
    };
  });

  logger.info("totalAmount: " + totalAmount);
  return {
    period: 'last_24_hours',
    totalAmount,
    currency_summary: currencySummary,
    expenses
  };
}

// -------------------- QUEUES --------------------
const QUEUES = [
  {
    name: 'inactive-ledger',
    processor: notifyInactiveLedgerUsers,
    cron: '0 8 * * *',
    jobId: 'inactive-ledger-job'
  },
  {
    name: 'new-users',
    processor: notifyNewUsersWithoutLedger,
    cron: '0 10 * * *',
    jobId: 'new-users-job'
  },
  {
    name: 'story-request',
    processor: requestStoryFromUsers,
    cron: '0 6 * * 1,3,6',
    jobId: 'story-request-job',
  },
  {
    name: 'daily-24h-insights',
    processor: daily24hInsightsJob,
    cron: '0 2 * * *',
    jobId: 'daily-24h-insights'
  }
];

// -------------------- BOOTSTRAP --------------------
(async function bootstrap() {
  for (const q of QUEUES) {
    const queue = createQueue(q.name);
    queue.process(q.processor);

    if (!q.cron) {
      throw new Error(`Cron missing for queue ${q.name}`);
    }

    await queue.add(
      {},
      {
        jobId: q.jobId,
        repeat: { cron: q.cron }
      }
    );

    debug(`Queue ${q.name} scheduled with cron ${q.cron}`);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});

// notifyNewUsersWithoutLedger();
// requestStoryFromUsers()
// daily24hInsightsJob();