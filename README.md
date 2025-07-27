# kimi-report

#POST_API
curl -X POST http://localhost:3000/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"data\":{\"reportTitle\":\"گزارش فروش\",\"reportDate\":\"۱۴۰۴/۰۴/۲۷\",\"reportSummary\":\"در این گزارش فروش دو ماه اول سال بررسی می‌شود.\",\"salesTable\":[{\"month\":\"فروردین\",\"amount\":1200},{\"month\":\"اردیبهشت\",\"amount\":1500}],\"chartData\":[{\"month\":\"فروردین\",\"sales\":1200},{\"month\":\"اردیبهشت\",\"sales\":1500}]}}"