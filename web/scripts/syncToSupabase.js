// web/scripts/syncToSupabase.js - MAXIMUM DEBUGGING VERSION

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');
const { formatInTimeZone } = require('date-fns-tz');

console.log("--- SCRIPT START ---");

// --- Smart Environment Variable Loading ---
// This is the key change: It checks if it's running in a CI/CD environment.
// If not (i.e., running locally), it loads the .env.local file.
if (!process.env.CI) {
  console.log("Local environment detected. Loading .env.local file.");
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} else {
  console.log("CI environment detected. Using environment variables from workflow.");
}

// --- Configuration ---
const jsonFilePath = path.resolve(__dirname, '../public/newsletter.json');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Your configured timezone
const TIMEZONE = 'Europe/London';

// --- Log Loaded Configuration ---
// This will tell us if the secrets are being loaded correctly in the Action.
console.log(`Supabase URL loaded: ${supabaseUrl ? 'OK' : 'MISSING!'}`);
console.log(`Supabase Service Key loaded: ${supabaseServiceKey ? 'OK (hidden)' : 'MISSING!'}`);
console.log(`JSON File Path: ${jsonFilePath}`);

// Check for missing secrets and fail early if they aren't loaded.
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Check your repository secrets and workflow file.");
}

// --- Main Function ---
async function syncNewsletter() {
  console.log('🚀 Starting newsletter sync function...');

  try {
    // 1. Read the JSON file
    console.log("Reading file content...");
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    console.log("File read successfully.");
    const data = JSON.parse(fileContent);
    console.log("JSON parsed successfully. Data contains 'news' array:", Array.isArray(data.news));
    
    // Log a snippet of the data to verify content is not old/stale
    console.log("Sample Title from data:", data.news[0]?.title || "No title found in first news item");

    if (!data.news || !data.curiosity) {
      throw new Error('JSON file is invalid. It must contain "news" and "curiosity".');
    }
    
    // Generate the current date in the specified timezone
    const publicationDate = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd');
    console.log(`✅ Publication date determined: ${publicationDate}`);

    const newsletterRecord = {
      publication_date: publicationDate,
      content: {
        news: data.news,
        perspective: data.perspective,
        curiosity: data.curiosity
      },
    };
    console.log("Record prepared for Supabase.");

    // 2. Connect to Supabase
    // We initialize the client inside the function to ensure it uses the loaded variables
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Supabase client initialized.");

    // 3. Upsert data
    console.log("Attempting to upsert data to 'newsletters' table...");
    const { data: dbData, error: dbError } = await supabase
      .from('newsletters')
      .upsert(newsletterRecord, { onConflict: 'publication_date' });

    console.log("Upsert operation complete.");

    // 4. Check for errors from Supabase
    if (dbError) {
      console.error("Supabase returned an error:", JSON.stringify(dbError, null, 2));
      throw dbError; // This will fail the workflow step with a red X
    }

    // 5. Log success and the data returned from Supabase
    console.log("Supabase returned no errors.");
    console.log("Data returned from Supabase after upsert:", JSON.stringify(dbData, null, 2));
    console.log('🎉 Successfully synced newsletter to Supabase!');

  } catch (error) {
    console.error('❌ FATAL ERROR in catch block:', error.message);
    process.exit(1); // Exit with an error code to make the GitHub Action fail
  }
}

// Run the main function
syncNewsletter();