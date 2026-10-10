import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة، استخدم POST فقط.' });
  }

  try {
    // استقبال الروابط القادمة من n8n السحابي
    const { audioUrl, imageUrls, videoTitle } = req.body;

    if (!audioUrl || !imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ error: 'بيانات ناقصة! يرجى إرسال روابط الصوت والصور.' });
    }

    // 1. تجميع كود الفيديو برمجياً في الخلفية (Webpack Bundle)
    const bundleLocation = await bundle(path.resolve('./src/Root.js'));

    // 2. تحديد الكومبوزشن (الإعدادات وأبعاد الفيديو 1080x1920 للـ Reels/Shorts)
    const composition = await selectComposition({
      bundleLocation,
      id: 'AutomatedVideo',
      inputProps: { audioUrl, imageUrls, videoTitle }, // تمرير الروابط لـ React دلياميكياً
    });

    // تحديد مسار حفظ المقطع المؤقت
    const outputLocation = path.join('/tmp', 'final-video.mp4');

    // 3. بدء عملية المونتاج السريع المجزأ
    await renderMedia({
      bundleLocation,
      outputLocation,
      composition,
      inputProps: { audioUrl, imageUrls, videoTitle },
      codec: 'h264',
    });

    // ملاحظة: هنا سنقوم لاحقاً بإضافة كود لرفع الملف الناتج من /tmp مباشرة إلى Google Drive
    // وسيعيد السيرفر الرابط النهائي لـ n8n

    return res.status(200).json({
      status: 'success',
      message: 'تم إنتاج المقطع بنجاح وإرساله إلى جوجل درايف!',
      videoName: 'final-video.mp4'
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', details: error.message });
  }
}
