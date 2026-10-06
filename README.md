# Study OS
PWA آفلاین و Local-first برای پیگیری مطالعه کنکور.

## اجرا
پروژه را روی GitHub Pages یا هر static host با HTTPS قرار دهید. Service Worker و نصب PWA فقط در secure context (HTTPS، به‌جز localhost) فعال می‌شوند.

## معماری
- IndexedDB برای Subjects، Daily Records، Sessions، Notes و Snapshots
- Service Worker با cache-first برای assetها و fallback آفلاین
- تقویم شمسی کاملاً local
- Timer بر پایه timestamp و قابل بازیابی پس از background/refresh
- گزارش چاپی/PDF با Print to PDF

## Read-only link
در نسخه static بدون backend، لینک revoke/expiration سرورمحور ممکن نیست. معماری Snapshot برای اضافه‌شدن backend در آینده آماده است.
