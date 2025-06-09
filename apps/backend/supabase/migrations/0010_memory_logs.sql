CREATE TABLE IF NOT EXISTS "memory_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "conversation_id" uuid,
    "content" text NOT NULL,
    "summary" text,
    "sentiment" varchar,
    "intents" jsonb NOT NULL DEFAULT '[]',
    "timezone" varchar,
    "device" varchar,
    "agent_chain" jsonb NOT NULL DEFAULT '[]',
    "source" varchar,
    "mbti" varchar,
    "big_five" jsonb,
    "psychology_model_confidence" numeric,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
