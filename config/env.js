// Environment configuration
module.exports = {
    // OpenAI Configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    
    // Naukri Configuration
    NAUKRI_EMAIL: process.env.NAUKRI_EMAIL || '',
    NAUKRI_PASSWORD: process.env.NAUKRI_PASSWORD || '',
    
    // WhatsApp Configuration
    WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED === 'true' || false,
    
    // Download Configuration
    DOWNLOAD_PATH: process.env.DOWNLOAD_PATH || './data/resumes',
    
    // Browser Configuration
    HEADLESS: process.env.HEADLESS === 'true' || false,
    BROWSER_TIMEOUT: parseInt(process.env.BROWSER_TIMEOUT) || 30000,
};
