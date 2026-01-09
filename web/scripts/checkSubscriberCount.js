// web/scripts/checkSubscriberCount.js
// Quick script to check subscriber counts by status

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables if running locally
if (!process.env.CI) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Check your .env.local file.");
}

async function checkSubscribers() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get total count
  const { count: totalCount, error: totalError } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    console.error("Error fetching total count:", totalError.message);
    return;
  }

  // Get active count
  const { count: activeCount, error: activeError } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (activeError) {
    console.error("Error fetching active count:", activeError.message);
    return;
  }

  // Get pending count
  const { count: pendingCount, error: pendingError } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (pendingError) {
    console.error("Error fetching pending count:", pendingError.message);
    return;
  }

  console.log("\n📊 Subscriber Count Summary:");
  console.log("═══════════════════════════════════");
  console.log(`Total subscribers:   ${totalCount}`);
  console.log(`Active (confirmed):  ${activeCount} ✓`);
  console.log(`Pending:             ${pendingCount} ⏳`);
  console.log("═══════════════════════════════════");
  console.log(`\n💡 The homepage shows count when active > 10`);
  console.log(`Current status: ${activeCount > 10 ? `✓ Will show "${activeCount}+"` : '✗ Shows "Be among the first to join"'}\n`);
}

checkSubscribers();
