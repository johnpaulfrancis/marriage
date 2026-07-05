export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientData = req.body;

    // 1. Get the IP address from Vercel's headers
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(',')[0].trim() : req.headers['x-real-ip'] || 'Unknown';
    const networkAsn = req.headers['x-vercel-ip-as-number'] || 'Unknown';
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const region = req.headers['x-vercel-ip-country-region'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown';
    const latLong = (req.headers['x-vercel-ip-latitude'] && req.headers['x-vercel-ip-longitude']) 
      ? `${req.headers['x-vercel-ip-latitude']}, ${req.headers['x-vercel-ip-longitude']}` 
      : 'Unknown';

    // 2. Get the exact server time
    const time = new Date().toISOString();

    // 3. Map the data to your Google Form entry IDs
    const formData = new URLSearchParams();
    
    // REPLACE THESE entry.XXXXXX numbers with your actual Google Form IDs
    formData.append('entry.193003679', ip);
    formData.append('entry.270212215', time);
    formData.append('entry.1279096273', clientData.url || 'Unknown');
    formData.append('entry.292017210', clientData.queryParams || 'None');
    formData.append('entry.220629650', clientData.userAgent || 'Unknown');
    formData.append('entry.290741101', clientData.resolution || 'Unknown');
    formData.append('entry.1855823966', clientData.language || 'Unknown');
    formData.append('entry.226902128', clientData.timeZone || 'Unknown');
    formData.append('entry.1956517772', clientData.referrer || 'Direct');
    formData.append('entry.2051106224', clientData.isMobile || 'Unknown');
    formData.append('entry.475709420', clientData.deviceMemory || 'Unknown'); // Device RAM
    formData.append('entry.2041170389', clientData.cpuCores || 'Unknown');     // CPU Cores
    formData.append('entry.187399406', clientData.orientation || 'Unknown');  // Screen Orientation (Portrait/Landscape)
    formData.append('entry.2011853764', clientData.networkType || 'Unknown');  // Connection speed (e.g., 4g)
    formData.append('entry.985210631', city);                                 // Extracted City (e.g., Kochi)
    formData.append('entry.1887244689', region);                               // Extracted State (e.g., KL)
    formData.append('entry.47038534', latLong);                              // Coordinates (Lat, Long)
    formData.append('entry.679522007', networkAsn);                          // Network ASN
    

    // REPLACE THIS with your actual Google Form Action URL
    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSc76hkYiygfIBHRZ2Rs7FB5cuF5JuTFtK9WVOyGPWpnrtNVSQ/formResponse';

    // 4. Send the data to Google Forms
    await fetch(googleFormActionURL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Send a success response back to your website
    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}