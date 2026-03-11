'use client';

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { useEffect, useState } from 'react';

interface ShaderBackgroundProps {
  mood?: string;
}

// Mood-based gradient configurations
const moodConfigs = {
  happy: {
    color1: '#FFD700',
    color2: '#FF6B6B',
    color3: '#FFA502',
    animate: 'on' as const,
    uSpeed: 0.4,
    uStrength: 2.5,
    uFrequency: 5.5,
    cDistance: 3.6,
    cPolarAngle: 90,
    cAzimuthAngle: 180,
    brightness: 1.2,
    type: 'plane' as const,
  },
  relaxing: {
    color1: '#A8E6CF',
    color2: '#88D8C0',
    color3: '#B8A9FF',
    animate: 'on' as const,
    uSpeed: 0.2,
    uStrength: 1.5,
    uFrequency: 5.5,
    cDistance: 4.2,
    cPolarAngle: 115,
    cAzimuthAngle: 180,
    brightness: 1.0,
    type: 'waterPlane' as const,
  },
  rainy: {
    color1: '#74B9FF',
    color2: '#636E72',
    color3: '#6C5CE7',
    animate: 'on' as const,
    uSpeed: 0.15,
    uStrength: 2.0,
    uFrequency: 5.5,
    cDistance: 4.5,
    cPolarAngle: 120,
    cAzimuthAngle: 180,
    brightness: 0.9,
    type: 'waterPlane' as const,
  },
  calm: {
    color1: '#81ECEC',
    color2: '#74B9FF',
    color3: '#A29BFE',
    animate: 'on' as const,
    uSpeed: 0.1,
    uStrength: 1.8,
    uFrequency: 5.5,
    cDistance: 4.0,
    cPolarAngle: 110,
    cAzimuthAngle: 180,
    brightness: 1.1,
    type: 'plane' as const,
  },
  focus: {
    color1: '#0984E3',
    color2: '#6C5CE7',
    color3: '#FD79A8',
    animate: 'on' as const,
    uSpeed: 0.3,
    uStrength: 2.2,
    uFrequency: 5.5,
    cDistance: 3.8,
    cPolarAngle: 100,
    cAzimuthAngle: 180,
    brightness: 1.15,
    type: 'plane' as const,
  },
  breeze: {
    color1: '#74B9FF',
    color2: '#00CEC9',
    color3: '#55EFC4',
    animate: 'on' as const,
    uSpeed: 0.35,
    uStrength: 2.0,
    uFrequency: 5.5,
    cDistance: 3.5,
    cPolarAngle: 95,
    cAzimuthAngle: 180,
    brightness: 1.2,
    type: 'waterPlane' as const,
  },
  default: {
    color1: '#F2E52C',
    color2: '#ACDCAC',
    color3: '#99ACDC',
    animate: 'on' as const,
    uSpeed: 0.2,
    uStrength: 2.0,
    uFrequency: 5.5,
    cDistance: 4.0,
    cPolarAngle: 115,
    cAzimuthAngle: 180,
    brightness: 1.1,
    type: 'plane' as const,
  },
};

export default function ShaderBackground({
  mood = 'default',
}: ShaderBackgroundProps) {
  const [currentConfig, setCurrentConfig] = useState(moodConfigs.default);

  useEffect(() => {
    const validMoods = [
      'happy',
      'relaxing',
      'rainy',
      'calm',
      'focus',
      'breeze',
    ];
    const selectedMood = validMoods.includes(mood) ? mood : 'default';
    setCurrentConfig(moodConfigs[selectedMood as keyof typeof moodConfigs]);
  }, [mood]);

  return (
    <div className='absolute inset-0 z-[-10]'>
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        pixelDensity={1.5}
      >
        <ShaderGradient
          {...currentConfig}
          lightType='3d'
          envPreset='city'
          grain='on'
          reflection={0.1}
          rotationX={0}
          rotationY={10}
          rotationZ={0}
          range='enabled'
          rangeStart={0}
          rangeEnd={40}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
