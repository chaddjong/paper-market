import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqtqtxtghwrqkmeomcyd.supabase.co';
const supabaseKey = 'sb_publishable_v5ByTKmF-hF_MaLI_PYHog_-a7Bovw9';

export const supabase = createClient(supabaseUrl, supabaseKey);
