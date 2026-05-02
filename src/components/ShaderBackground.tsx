'use client';

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { useEffect, useState } from 'react';

interface ShaderBackgroundProps {
  mood?: string;
}

// Mood-based gradient configurations
// Colors are blended versions of the original mood overlays + holographic bg.jpg
// (simulating mix-blend-mode: lighten with the periwinkle/pink/yellow base image)
const moodConfigs = {
  happy: {
    color1: '#FFE08A', // gold softened with bg's warm yellow
    color2: '#F9A8C4', // coral blended with bg's rose pink
    color3: '#FFCF7B', // orange lightened with bg's yellow
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
    color1: '#C8E8A0', // soft sage green
    color2: '#E0F0B0', // light lime yellow
    color3: '#A8D8B0', // meadow green
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
    color1: '#B8EDDC', // soft mint
    color2: '#E8C0FF', // pink-lavender
    color3: '#F0D0E8', // warm blush pink
    animate: 'on' as const,
    uSpeed: 0.15,
    uStrength: 2.0,
    uFrequency: 5.5,
    cDistance: 4.5,
    cPolarAngle: 120,
    cAzimuthAngle: 180,
    brightness: 1.1,
    type: 'waterPlane' as const,
  },
  calm: {
    color1: '#A0ECEC', // soft cyan
    color2: '#B0E0D0', // seafoam green
    color3: '#C8F0E0', // pale aqua mint
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
    color1: '#6878D0', // deep indigo
    color2: '#9070C8', // rich violet
    color3: '#B868D8', // electric purple
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
    color1: '#90C8FF', // sky blue softened with bg's blue
    color2: '#60D8D8', // teal lightened with bg's cyan
    color3: '#80F0D0', // mint lightened with bg's green-yellow
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
    color1: '#F2E88C', // yellow softened with bg's warm yellow
    color2: '#BCDCBC', // sage lightened with bg's green
    color3: '#A0B8E0', // steel blue blended with bg's periwinkle
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
