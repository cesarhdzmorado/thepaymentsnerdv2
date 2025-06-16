// web/scripts/syncToSupabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// --- Configuration ---
const jsonFilePath = path.resolve(__dirname, '../public/newsletter.json');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// ---------------------

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Check your .env.local file.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncNewsletter() {
  console.log('🚀 Starting newsletter sync...');

  try {
    // 1. Read the JSON file
    console.log(`Reading file from: ${jsonFilePath}`);
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // 2. NEW: Validate the actual data structure
    if (!data.news || !data.curiosity) {
      throw new Error('JSON file is invalid. It must contain "news" (an array) and "curiosity" (an object).');
    }
    console.log(`✅ Read ${data.news.length} news items.`);

    // 3. Prepare the record for Supabase
    const newsletterRecord = {
      // We will use today's date for the publication_date.
      // Supabase format is 'YYYY-MM-DD'.
      publication_date: new Date().toISOString().split('T')[0],

      // We store the ENTIRE JSON object directly in the 'content' column.
      // This is the power of JSONB fields.
      content: data,
    };

    // 4. Upsert the data to the 'newsletters' table
    // We use 'onConflict' on the 'publication_date' to ensure only one
    // newsletter is stored per day.
    console.log(`Syncing newsletter for date: ${newsletterRecord.publication_date}`);
    const { error } = await supabase
      .from('newsletters')
      .upsert(newsletterRecord, { onConflict: 'publication_date' });

    if (error) {
      throw error;
    }

    console.log('🎉 Successfully synced newsletter to Supabase!');

  } catch (error) {
    console.error('❌ An error occurred during the sync process:');
    console.error(error.message);
    process.exit(1);
  }
}

syncNewsletter();