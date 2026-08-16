const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Load .env.local / .env file variables manually
function loadEnv() {
  const candidates = [
    path.join(__dirname, "../.env.local"),
    path.join(__dirname, "../.env"),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = value.trim();
          }
        }
      });
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === "your-supabase-service-role-key-here") {
  console.error("\nError: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  console.log("\nTo get your Service Role Key:");
  console.log("1. Open your Supabase Dashboard.");
  console.log("2. Navigate to Project Settings > API.");
  console.log("3. Under 'Project API Keys', copy the 'service_role' key.");
  console.log("4. Paste it in your .env file as: SUPABASE_SERVICE_ROLE_KEY=your-copied-key\n");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const email = process.argv[2];

if (!email) {
  console.error("Error: Please provide the email address of the user you want to make an admin.");
  console.log("Usage: node scripts/set-admin.js user@example.com");
  process.exit(1);
}

async function setAdmin() {
  console.log(`Connecting to Supabase...`);
  
  // 1. Find user by email in Supabase Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users from Supabase Auth:", listError.message);
    process.exit(1);
  }

  const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`Error: User with email '${email}' not found in Supabase Auth.`);
    console.log("Make sure the user has signed up or been created in Supabase Auth first.");
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (ID: ${user.id})`);

  // 2. Update user's app_metadata role in Supabase Auth
  const currentMetadata = user.app_metadata || {};
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...currentMetadata,
      role: "admin",
    },
  });

  if (error) {
    console.error("Error updating user metadata in Supabase:", error.message);
    process.exit(1);
  }

  // 3. Create or update AdminProfile in Prisma database
  const name = user.user_metadata?.name || user.user_metadata?.full_name || email.split("@")[0];
  await prisma.adminProfile.upsert({
    where: { id: user.id },
    update: {
      isBlocked: false,
      role: "admin",
    },
    create: {
      id: user.id,
      email: email.toLowerCase(),
      name,
      role: "admin",
      isBlocked: false,
    },
  });

  console.log(`\nSuccess! User ${email} has been successfully granted administrator privileges in Supabase Auth & Database.`);
}

setAdmin()
  .catch((e) => {
    console.error("Error setting admin profile:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
