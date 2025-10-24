# 🎨 Pharmacist Queue - UI Guide

## 📱 Page Layout

### Desktop View (Full Width)
```
┌─────────────────────────────────────────────────────────────────────┐
│ 💊 Patient Queue                          [Back to Dashboard]       │
│ View patients with prescribed medicines                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Search Patients                                                     │
│ [Search by patient name or ID...]                                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐  ┌────────────────────────┐
│ Patients with Prescriptions              │  │ Patient Details        │
│ 15 patients found                        │  │                        │
│                                          │  │ Name: John Doe         │
│ ┌──────────────────────────────────────┐ │  │ ID: P001               │
│ │ John Doe                             │ │  │ Age: 45 | M            │
│ │ ID: P001 | Age: 45 | M               │ │  │ Email: john@...        │
│ │ Phone: 9876543210                    │ │  │ Phone: 9876543210      │
│ │ 💊 5 medicines [View Details]        │ │  │                        │
│ └──────────────────────────────────────┘ │  │ 💊 Medicines (5)       │
│                                          │  │                        │
│ ┌──────────────────────────────────────┐ │  │ ┌────────────────────┐ │
│ │ Jane Smith                           │ │  │ │ Aspirin            │ │
│ │ ID: P002 | Age: 32 | F               │ │  │ │ Route: Oral        │ │
│ │ Phone: 9876543211                    │ │  │ │ Dose: 500mg        │ │
│ │ 💊 3 medicines [View Details]        │ │  │ │ Freq: Twice daily  │ │
│ └──────────────────────────────────────┘ │  │ │ Duration: 5 days   │ │
│                                          │  │ │ Dr: Dr. Rajesh     │ │
│ ┌──────────────────────────────────────┐ │  │ └────────────────────┘ │
│ │ Mike Johnson                         │ │  │                        │
│ │ ID: P003 | Age: 28 | M               │ │  │ ┌────────────────────┐ │
│ │ Phone: 9876543212                    │ │  │ │ Paracetamol        │ │
│ │ 💊 2 medicines [View Details]        │ │  │ │ Route: Oral        │ │
│ └──────────────────────────────────────┘ │  │ │ Dose: 650mg        │ │
│                                          │  │ │ Freq: Thrice daily │ │
│ [Scroll for more patients...]           │  │ │ Duration: 7 days   │ │
│                                          │  │ │ Dr: Dr. Priya      │ │
│                                          │  │ └────────────────────┘ │
│                                          │  │                        │
│                                          │  │ [Manage Medicines]     │
│                                          │  │                        │
└──────────────────────────────────────────┘  └────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Summary Statistics                                                  │
│ Total Patients: 15 | Total Prescriptions: 42 | Avg: 2.8 | Now      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View (Responsive)
```
┌─────────────────────────────┐
│ 💊 Patient Queue            │
│ [Back to Dashboard]         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Search Patients             │
│ [Search...]                 │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Patients with Prescriptions │
│ 15 patients found           │
│                             │
│ ┌─────────────────────────┐ │
│ │ John Doe                │ │
│ │ ID: P001 | Age: 45 | M  │ │
│ │ 💊 5 medicines          │ │
│ │ [View Details]          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Jane Smith              │ │
│ │ ID: P002 | Age: 32 | F  │ │
│ │ 💊 3 medicines          │ │
│ │ [View Details]          │ │
│ └─────────────────────────┘ │
│                             │
│ [Scroll for more...]        │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Patient Details             │
│                             │
│ Name: John Doe              │
│ ID: P001                    │
│ Age: 45 | M                 │
│ Email: john@...             │
│ Phone: 9876543210           │
│                             │
│ 💊 Medicines (5)            │
│                             │
│ ┌─────────────────────────┐ │
│ │ Aspirin                 │ │
│ │ Route: Oral             │ │
│ │ Dose: 500mg             │ │
│ │ Freq: Twice daily       │ │
│ │ Duration: 5 days        │ │
│ │ Dr: Dr. Rajesh          │ │
│ └─────────────────────────┘ │
│                             │
│ [Manage Medicines]          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Summary Statistics          │
│ Total: 15 | Prescriptions: 42
│ Avg: 2.8 | Last: Now        │
└─────────────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
- **Orange (#FF9800)** - Pharmacist theme
- **Green (#90EE90)** - Patient Queue button
- **Blue (#87CEEB)** - Secondary actions
- **Gray (#808080)** - Text and borders

### Background Colors
- **White (#FFFFFF)** - Cards and content
- **Light Gray (#F5F5F5)** - Page background
- **Orange Tint (#FFE4B5)** - Hover states
- **Orange Light (#FFA500)** - Badges

### Status Colors
- **Blue (#2196F3)** - Route badges
- **Orange (#FF9800)** - Primary actions
- **Green (#4CAF50)** - Success states
- **Red (#F44336)** - Error states

---

## 🎯 Component Breakdown

### Header Section
```
┌─────────────────────────────────────────────────────────┐
│ 💊 Patient Queue                                        │
│ View patients with prescribed medicines                │
│                                    [Back to Dashboard]  │
└─────────────────────────────────────────────────────────┘
```
- Title with icon
- Description
- Back button

### Search Section
```
┌─────────────────────────────────────────────────────────┐
│ Search Patients                                         │
│ Find patients by name or patient ID                    │
│ [Search by patient name or ID...]                      │
└─────────────────────────────────────────────────────────┘
```
- Title
- Description
- Input field

### Patient Card
```
┌─────────────────────────────────────────────────────────┐
│ John Doe                                                │
│ ID: P001 | Age: 45 | M                                 │
│ Phone: 9876543210                                      │
│                                    💊 5 medicines       │
│                                    [View Details]       │
└─────────────────────────────────────────────────────────┘
```
- Patient name
- Patient ID, age, sex
- Phone number
- Medicine count badge
- View details button

### Patient Details Sidebar
```
┌─────────────────────────────────────────────────────────┐
│ Patient Details                                    [✕]  │
├─────────────────────────────────────────────────────────┤
│ Name: John Doe                                          │
│ ID: P001                                                │
│ Age: 45 | M                                             │
│ Email: john@example.com                                 │
│ Phone: 9876543210                                       │
│                                                         │
│ 💊 Medicines (5)                                        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Aspirin                                    [Oral]   │ │
│ │ Dose: 500mg                                         │ │
│ │ Frequency: Twice daily                              │ │
│ │ Duration: 5 days                                    │ │
│ │ Prescribed by: Dr. Rajesh Kumar                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Manage Medicines]                                      │
└─────────────────────────────────────────────────────────┘
```
- Patient info grid
- Close button
- Scrollable medicines list
- Medicine details
- Action button

### Statistics Card
```
┌─────────────────────────────────────────────────────────┐
│ Total Patients: 15                                      │
│ Total Prescriptions: 42                                 │
│ Avg Medicines/Patient: 2.8                              │
│ Last Updated: Just now                                  │
└─────────────────────────────────────────────────────────┘
```
- Four stat boxes
- Icons and values
- Last updated time

---

## 🎨 Typography

### Headings
- **Page Title** - 3xl, bold, gray-900
- **Section Title** - 2xl, bold, gray-900
- **Card Title** - xl, bold, gray-900
- **Patient Name** - lg, semibold, gray-900

### Body Text
- **Description** - sm, gray-600
- **Patient Info** - sm, gray-700
- **Medicine Details** - sm, gray-700
- **Labels** - sm, gray-600

### Badges
- **Medicine Count** - sm, orange-800 on orange-100
- **Route** - xs, blue-800 on blue-100
- **Status** - sm, color-800 on color-100

---

## 🎯 Interactive Elements

### Buttons
- **Primary** - Orange background, white text
- **Secondary** - White background, gray text
- **Hover** - Darker shade
- **Active** - Darker shade with shadow

### Input Fields
- **Search Box** - Full width, gray border
- **Focus** - Blue border, shadow
- **Placeholder** - Gray text

### Cards
- **Normal** - White background, gray border
- **Hover** - Light orange background
- **Active** - Orange border

### Badges
- **Medicine Count** - Orange background
- **Route** - Blue background
- **Status** - Color-coded

---

## 📐 Spacing & Layout

### Padding
- **Page** - 6 (24px)
- **Card** - 6 (24px)
- **Section** - 4 (16px)
- **Element** - 2-4 (8-16px)

### Gaps
- **Grid** - 6 (24px)
- **List** - 3 (12px)
- **Inline** - 2-4 (8-16px)

### Margins
- **Header** - 8 (32px) bottom
- **Section** - 6 (24px) bottom
- **Card** - 4 (16px) bottom

---

## 🔄 Responsive Breakpoints

### Desktop (lg and above)
- 3-column layout
- Sidebar sticky
- Full width search
- All details visible

### Tablet (md)
- 2-column layout
- Sidebar scrollable
- Full width search
- Optimized spacing

### Mobile (sm and below)
- 1-column layout
- Sidebar below list
- Full width search
- Stacked layout

---

## ✨ Visual Effects

### Hover Effects
- Patient cards - Light orange background
- Buttons - Darker shade
- Links - Underline

### Transitions
- Smooth color changes
- Fade in/out effects
- Slide animations

### Shadows
- Cards - Light shadow
- Hover - Increased shadow
- Focus - Blue shadow

---

## 🎯 Accessibility

### Color Contrast
- ✅ WCAG AA compliant
- ✅ Text readable on backgrounds
- ✅ Icons have labels

### Keyboard Navigation
- ✅ Tab through elements
- ✅ Enter to activate
- ✅ Escape to close

### Screen Readers
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Alt text for icons

---

## 📱 Mobile Optimization

### Touch Targets
- ✅ Minimum 44x44px
- ✅ Adequate spacing
- ✅ Easy to tap

### Performance
- ✅ Fast loading
- ✅ Smooth scrolling
- ✅ Optimized images

### Usability
- ✅ Large text
- ✅ Clear buttons
- ✅ Minimal scrolling

---

## 🎉 Summary

The UI is designed to be:
- **Professional** - Clean and organized
- **Intuitive** - Easy to understand
- **Responsive** - Works on all devices
- **Accessible** - Usable by everyone
- **Efficient** - Quick workflows
- **Beautiful** - Visually appealing

**Ready for production! 🚀**


