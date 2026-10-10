import { RegisterComposition } from 'remotion';
import { VideoComposition } from './Video'; // استيراد المكون من ملف Video.js الجديد
import React from 'react';

export const RemotionRoot = () => {
  return (
    <>
      <RegisterComposition
        id="AutomatedVideo"
        component={VideoComposition}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1800} // تعادل دقيقة واحدة كقيمة افتراضية تتغير ديناميكياً مع طول الصوت
        defaultProps={{
          audioUrl: '',
          imageUrls: [],
          videoTitle: 'عنوان الفيديو التلقائي'
        }}
      />
    </>
  );
};
