import { Audio, useVideoConfig, Sequence } from 'remotion';
import React from 'react';

export const VideoComposition = ({ audioUrl, imageUrls, videoTitle }) => {
  const { durationInFrames } = useVideoConfig();
  
  // حساب عدد الفريمات (الإطارات) المخصصة لكل صورة بالتساوي
  const numberOfImages = imageUrls ? imageUrls.length : 0;
  const framesPerImage = numberOfImages > 0 ? Math.floor(durationInFrames / numberOfImages) : durationInFrames;

  return (
    <div style={{ flex: 1, backgroundColor: 'black', position: 'relative', width: 1080, height: 1920 }}>
      {/* 1. تشغيل ملف الصوت في الخلفية القادم من الـ API */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* 2. عرض الصور بالتتابع الزمني التلقائي والموزع ذكياً */}
      {imageUrls && imageUrls.map((url, index) => {
        const startFrame = index * framesPerImage;
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={framesPerImage}
          >
            <img
              src={url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt={`Slide ${index}`}
            />
          </Sequence>
        );
      })}

      {/* 3. طبقة نصية لعرض العنوان الرئيسي للمقطع إذا رغبت */}
      {videoTitle && (
        <div style={{
          position: 'absolute',
          bottom: 150,
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontSize: 60,
          fontFamily: 'sans-serif',
          textShadow: '3px 3px 10px rgba(0,0,0,0.8)',
          padding: '0 40px',
          direction: 'rtl'
        }}>
          {videoTitle}
        </div>
      )}
    </div>
  );
};
