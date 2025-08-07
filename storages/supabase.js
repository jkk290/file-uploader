const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET;

const supabase = createClient(url,key);

module.exports = supabase;