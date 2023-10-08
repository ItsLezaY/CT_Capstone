import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

export const TimeComponent: React.FC = () => {
    const theme = useTheme();

    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const getCurrentTime = () => {
            axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo')
            .then(response => {
                const rawTime = new Date(response.data.utc_datetime);
                setCurrentTime(rawTime.toLocaleString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Tokyo'
                }));
            })
            .catch(error => {
                console.error('Error fetching time:', error);
            });
        }

        getCurrentTime();

        const interval = setInterval(() => {
            getCurrentTime();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '15px', marginBottom: '-3rem' }}>{currentTime}</p>
        </div>
    );
};


