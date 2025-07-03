from datetime import datetime, timedelta

# إعدادات البداية: 1 محرم 1447 هجري = 27 يونيو 2025 ميلادي
start_date = datetime(2025, 6, 27)
days_in_muharram = 30

# ترويسة ملف التقويم
calendar_header = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hijri Dates Direct Add//Muharram1447//EN
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Asia/Riyadh
X-LIC-LOCATION:Asia/Riyadh
BEGIN:STANDARD
TZOFFSETFROM:+0300
TZOFFSETTO:+0300
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
"""

calendar_footer = "END:VCALENDAR"

# دالة لإنشاء حدث باسم التاريخ الهجري
def create_event(date, hijri_day):
    dt_start = date.strftime('%Y%m%d')
    return f"""BEGIN:VEVENT
DTSTART;VALUE=DATE:{dt_start}
SUMMARY:{hijri_day} محرم 1447 هـ
END:VEVENT
"""

# توليد الأحداث اليومية
events = ""
for day in range(days_in_muharram):
    hijri_day = day + 1
    current_date = start_date + timedelta(days=day)
    events += create_event(current_date, hijri_day)

# دمج محتوى ملف التقويم
ics_content = calendar_header + events + calendar_footer

# حفظ الملف بصيغة .ics
with open("hijri1447_direct.ics", "w", encoding="utf-8") as f:
    f.write(ics_content)