import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = globalThis.process?.env.PORT || 4000;
const dataPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data.json",
);
const exchangeRate = Number(globalThis.process?.env.ZIG_PER_USD || 40);
const whatsappToken = globalThis.process?.env.WHATSAPP_ACCESS_TOKEN;
const whatsappPhoneNumberId = globalThis.process?.env.WHATSAPP_PHONE_NUMBER_ID;
const whatsappApiVersion =
  globalThis.process?.env.WHATSAPP_API_VERSION || "v22.0";
const whatsappTemplateName = globalThis.process?.env.WHATSAPP_TEMPLATE_NAME;
const whatsappTemplateLanguage =
  globalThis.process?.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";
const schedulerIntervalMs = 60 * 60 * 1000;
const weekMs = 7 * 24 * 60 * 60 * 1000;
let reminderJobRunning = false;

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    name: "Business Tracker API",
    status: "running",
    frontend: "http://localhost:5173",
    health: "/api/health",
  });
});

async function readData() {
  try {
    return JSON.parse(await fs.readFile(dataPath, "utf8"));
  } catch {
    return { credits: [], reminders: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

function normalizeCredit(input) {
  const currency = input.currency === "ZiG" ? "ZiG" : "USD";
  const amount = Number(input.amount);
  if (
    !input.customer ||
    !input.dueDate ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }
  return {
    id: input.id || Date.now(),
    customer: String(input.customer).trim(),
    phone: String(input.phone || "").trim(),
    description: String(input.description || "").trim(),
    amount,
    currency,
    amountUsd: currency === "ZiG" ? amount / exchangeRate : amount,
    dueDate: input.dueDate,
    reminderEnabled: input.reminderEnabled !== false,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

function getOverdueWeeks(credit, today = new Date()) {
  const dueDate = new Date(`${credit.dueDate}T00:00:00`);
  if (Number.isNaN(dueDate.getTime()) || today <= dueDate) return 0;
  return Math.floor((today.getTime() - dueDate.getTime()) / weekMs);
}

function withCurrentBalance(credit) {
  const principalUsd = Number(credit.amountUsd ?? credit.amount ?? 0);
  const overdueWeeks = getOverdueWeeks(credit);
  return {
    ...credit,
    currentAmountUsd: principalUsd * 1.1 ** overdueWeeks,
    overdueWeeks,
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "business-tracker-api" });
});

app.get("/api/config", (_request, response) => {
  response.json({ exchangeRate, currencies: ["USD", "ZiG"] });
});

app.get("/api/credits", async (_request, response) => {
  const data = await readData();
  response.json(data.credits.map(withCurrentBalance));
});

app.post("/api/credits", async (request, response) => {
  const credit = normalizeCredit(request.body);
  if (!credit)
    return response
      .status(400)
      .json({ error: "Customer, amount, and due date are required." });
  const data = await readData();
  data.credits = [
    credit,
    ...data.credits.filter((entry) => entry.id !== credit.id),
  ].slice(0, 100);
  await writeData(data);
  response.status(201).json(withCurrentBalance(credit));
});

app.delete("/api/credits/:id", async (request, response) => {
  const data = await readData();
  data.credits = data.credits.filter(
    (entry) => String(entry.id) !== request.params.id,
  );
  await writeData(data);
  response.status(204).end();
});

function whatsappUrl(phone, message) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function dateDaysFromToday(dateString) {
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dueDate = new Date(`${dateString}T00:00:00`);
  const dueUtc = Date.UTC(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  return Math.round((dueUtc - todayUtc) / (24 * 60 * 60 * 1000));
}

function reminderKey(credit) {
  return `${credit.id}:${credit.dueDate}`;
}

async function sendWhatsAppMessage(credit, message) {
  if (!whatsappToken || !whatsappPhoneNumberId || !credit.phone) {
    return {
      delivered: false,
      reason: !credit.phone ? "missing_phone" : "whatsapp_not_configured",
    };
  }
  const messagePayload = whatsappTemplateName
    ? {
        messaging_product: "whatsapp",
        to: credit.phone.replace(/\D/g, ""),
        type: "template",
        template: {
          name: whatsappTemplateName,
          language: { code: whatsappTemplateLanguage },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: credit.customer },
                {
                  type: "text",
                  text: `${credit.currency} ${credit.amount.toFixed(2)}`,
                },
                { type: "text", text: credit.dueDate },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: credit.phone.replace(/\D/g, ""),
        type: "text",
        text: { body: message },
      };
  const response = await fetch(
    `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    },
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
  return { delivered: true };
}

async function sendScheduledReminders() {
  if (reminderJobRunning) return;
  reminderJobRunning = true;
  try {
    const data = await readData();
    const sentKeys = new Set(
      data.reminders
        .filter((reminder) => reminder.automated && reminder.delivered)
        .map((reminder) => reminder.key),
    );
    let changed = false;
    for (const credit of data.credits) {
      if (!credit.reminderEnabled || dateDaysFromToday(credit.dueDate) !== 3)
        continue;
      const key = reminderKey(credit);
      if (sentKeys.has(key)) continue;
      const message = `Hi ${credit.customer}, a friendly reminder that ${credit.currency} ${credit.amount.toFixed(2)} for ${credit.description || "your credit purchase"} is due on ${credit.dueDate}. Thank you.`;
      try {
        const result = await sendWhatsAppMessage(credit, message);
        if (!result.delivered) {
          console.warn(
            `Automated reminder skipped for ${credit.customer}: ${result.reason}`,
          );
          continue;
        }
        data.reminders = [
          {
            id: Date.now(),
            key,
            creditId: credit.id,
            sentAt: new Date().toISOString(),
            channel: "whatsapp",
            automated: true,
            delivered: true,
          },
          ...data.reminders,
        ].slice(0, 200);
        changed = true;
        console.log(`Automated WhatsApp reminder sent to ${credit.customer}`);
      } catch (error) {
        console.error(
          `Automated reminder failed for ${credit.customer}:`,
          error.message,
        );
      }
    }
    if (changed) await writeData(data);
  } finally {
    reminderJobRunning = false;
  }
}

app.post("/api/reminders/:id", async (request, response) => {
  const data = await readData();
  const credit = data.credits.find(
    (entry) => String(entry.id) === request.params.id,
  );
  if (!credit)
    return response.status(404).json({ error: "Credit entry not found." });
  const message = `Hi ${credit.customer}, a friendly reminder that ${credit.currency} ${credit.amount.toFixed(2)} for ${credit.description || "your credit purchase"} is due on ${credit.dueDate}. Thank you.`;
  const reminder = {
    id: Date.now(),
    creditId: credit.id,
    sentAt: new Date().toISOString(),
    channel: "whatsapp",
  };
  data.reminders = [reminder, ...data.reminders].slice(0, 200);
  await writeData(data);
  response.json({
    ...reminder,
    delivered: false,
    whatsappUrl: credit.phone ? whatsappUrl(credit.phone, message) : null,
    message,
  });
});

app.listen(port, () => {
  console.log(`Business Tracker API listening on http://localhost:${port}`);
  void sendScheduledReminders();
  setInterval(() => void sendScheduledReminders(), schedulerIntervalMs);
});
