import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, CloudFog, Loader2 } from 'lucide-react';

export default function Weather() {
  const [weather, setWeather] = useState({
    temp: '--',
    condition: 'লোড হচ্ছে...',
    location: 'ঢাকা, বাংলাদেশ',
    icon: Cloud
  });
  const [isLoading, setIsLoading] = useState(true);

  // WMO Weather Code Mapping to Bengali and Lucide Icons
  const getWeatherInfo = (code) => {
    if (code === 0) return { condition: 'পরিষ্কার আকাশ', icon: Sun };
    if (code >= 1 && code <= 3) return { condition: 'আংশিক মেঘলা', icon: Cloud };
    if (code === 45 || code === 48) return { condition: 'কুয়াশাচ্ছন্ন', icon: CloudFog };
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { condition: 'বৃষ্টিপাত', icon: CloudRain };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { condition: 'তুষারপাত', icon: CloudSnow };
    if (code >= 95 && code <= 99) return { condition: 'বজ্রঝড়', icon: CloudLightning };
    
    return { condition: 'অজানা', icon: Cloud };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Default Dhaka coordinates: Latitude 23.8103, Longitude 90.4125
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,weather_code&timezone=auto');
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        
        const temp = Math.round(data.current.temperature_2m);
        const wmoCode = data.current.weather_code;
        const { condition, icon } = getWeatherInfo(wmoCode);
        
        // Convert to Bengali Numerals
        const toBengaliNumber = (num) => num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

        setWeather({
          temp: toBengaliNumber(temp),
          condition: condition,
          location: 'ঢাকা, বাংলাদেশ',
          icon: icon
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather({
          temp: '২৪',
          condition: 'আংশিক মেঘলা',
          location: 'ঢাকা (অফলাইন)',
          icon: Cloud
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const WeatherIcon = weather.icon;

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
      padding: '1.25rem'
    }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          {weather.temp}°C
        </h2>
        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{weather.condition}</p>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-main)' }}>{weather.location}</p>
      </div>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '0.75rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-color)'
      }}>
        {isLoading ? <Loader2 size={32} color="var(--primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <WeatherIcon size={32} color="var(--primary)" />}
      </div>
    </div>
  );
}
