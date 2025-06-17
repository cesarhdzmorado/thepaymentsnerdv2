// web/scripts/syncToSupabase.js - Timezone-Aware Version

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');
const { formatInTimeZone } = require('date-fns-tz'); // <-- Import the new function
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// --- Configuration ---
const jsonFilePath = path.resolve(__dirname, '../public/newsletter.json');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// IMPORTANT: Set your primary timezone here.
// Find your timezone from this list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
// Example: 'America/New_York', 'Europe/London', 'America/Mexico_City'
const TIMEZONE = 'Europe/London';
// ---------------------

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Check your .env.local file.");
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncNewsletter() {
  console.log('🚀 Starting newsletter sync...');

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.news || !data.curiosity) {
      throw new Error('JSON file is invalid. It must contain "news" and "curiosity".');
    }
    
    // Generate the current date in the specified timezone
    const publicationDate = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd');
    console.log(`✅ Read ${data.news.length} news items. Using publication date: ${publicationDate}`);

    const newsletterRecord = {
      publication_date: publicationDate,
      content: { news: data.news, curiosity: data.curiosity },
    };

    console.log(`Syncing newsletter for date: ${newsletterRecord.publication_date}`);
    const { error } = await supabase
      .from('newsletters')
      .upsert(newsletterRecord, { onConflict: 'publication_date' });

    if (error) { throw error; }

    console.log('🎉 Successfully synced newsletter to Supabase!');
  } catch (error) {
    console.error('❌ An error occurred during the sync process:', error.message);
    process.exit(1);
  }
}

syncNewsletter();