const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load .env.local file variables manually
function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env.local file not found in project root.");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need the service role key to perform administrative operations (listing & updating users)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === "your-service-role-key") {
  console.error("\nError: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env.local file.");
  console.log("\nTo get your Service Role Key:");
  console.log("1. Open your Supabase Dashboard.");
  console.log("2. Navigate to Project Settings > API.");
  console.log("3. Under 'Project API Keys', copy the 'service_role' key (labeled 'secret, bypasses Row Level Security').");
  console.log("4. Paste it in your .env.local as: SUPABASE_SERVICE_ROLE_KEY=your-copied-key\n");
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
  console.log(`Connecting to Supabase at ${supabaseUrl}...`);
  
  // 1. Find user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users from Supabase Auth:", listError.message);
    process.exit(1);
  }

  const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`Error: User with email '${email}' not found in Supabase Auth.`);
    console.log("Make sure the user has signed up or been created first.");
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (ID: ${user.id})`);

  // 2. Update user's app_metadata role to 'admin'
  const currentMetadata = user.app_metadata || {};
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...currentMetadata,
      role: "admin",
    },
  });

  if (error) {
    console.error("Error updating user metadata:", error.message);
    process.exit(1);
  }

  console.log(`\nSuccess! User ${email} has been successfully granted 'admin' privileges.`);
}

setAdmin();
