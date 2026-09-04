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

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "business-tracker-api" });
});

app.get("/api/config", (_request, response) => {
  response.json({ exchangeRate, currencies: ["USD", "ZiG"] });
});

app.get("/api/credits", async (_request, response) => {
  const data = await readData();
  response.json(data.credits);
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
  response.status(201).json(credit);
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

app.listen(port, () =>
  console.log(`Business Tracker API listening on http://localhost:${port}`),
);
