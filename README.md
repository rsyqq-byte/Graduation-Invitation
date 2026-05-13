# Graduation Ceremony Invitation Website

A professional, responsive invitation website for teachers and parents to RSVP for a student graduation ceremony.

## Features

✅ **Elegant Design** - Modern, professional invitation layout with gradient colors
✅ **Responsive** - Works perfectly on desktop, tablet, and mobile devices
✅ **Event Details** - Display ceremony date, time, location, and dress code
✅ **Program Timeline** - Show the complete ceremony schedule
✅ **Important Information** - Parking, entry requirements, photography details
✅ **Interactive RSVP Form** - Easy-to-use form for guests to confirm attendance
✅ **Form Validation** - Real-time validation for email, phone, and name fields
✅ **Local Storage** - RSVPs are saved in browser's local storage
✅ **Admin Tools** - Console commands to view, export, and manage RSVPs
✅ **Accessible** - Semantic HTML and keyboard-friendly interface

## Files Included

- **index.html** - Main website structure and content
- **styles.css** - Complete styling with responsive design
- **script.js** - Form handling, validation, and RSVP management
- **README.md** - This documentation file

## How to Use

### 1. Open the Website
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Customize Content
Edit the following in `index.html`:
- **Event Date/Time/Location** - Update the date, time, and venue details
- **Program Schedule** - Modify the ceremony program times and activities
- **Contact Information** - Update the email and phone number
- **School Name** - Replace "School" with your actual school name
- **Graduation Date** - Change the RSVP deadline date

### 3. Customizing Colors
To change the color scheme, edit `styles.css`:
- Primary color: `#667eea` (purple-blue)
- Secondary color: `#764ba2` (darker purple)
- Background gradient: Look for the `linear-gradient` properties

### 4. Using the RSVP System
Guests can fill out and submit the RSVP form. The form includes:
- Full name (required)
- Email (required)
- Phone number (required)
- Relationship to graduate
- Student's name
- Number of guests
- Attendance confirmation
- Dietary restrictions
- Message for graduates

## Admin Features

Open the browser's **Developer Console** (F12 or right-click → Inspect → Console) and use these commands:

### View All RSVPs
```javascript
RSVPAdmin.viewAll()
```
Shows a table of all submitted RSVPs in the console.

### Export RSVPs as CSV
```javascript
RSVPAdmin.export()
```
Downloads all RSVPs as a CSV file that can be opened in Excel.

### Clear All RSVPs
```javascript
RSVPAdmin.clear()
```
Clears all stored RSVPs (use with caution!).

## Data Storage

RSVPs are stored in the browser's **localStorage**, which means:
- Data persists even after closing the browser
- Data is specific to each browser/device
- To migrate data between browsers, use the CSV export feature
- Clearing browser data will delete stored RSVPs

## Hosting Options

You can host this website using:
- **GitHub Pages** - Free, simple, and reliable
- **Netlify** - Free tier with auto-deployment
- **Vercel** - Free hosting for static sites
- **AWS S3** - Scalable cloud hosting
- **Any web hosting service** - Upload the 3 files to your server

## Browser Support

Works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

## Customization Tips

### Change Ceremony Date
Find this line in `index.html`:
```html
<p>June 15, 2026</p>
```
Replace with your actual date.

### Update Contact Information
Find this section:
```html
<p>Contact: graduation@school.edu | Phone: (555) 123-4567</p>
```
Update with your actual contact details.

### Modify School Name
Replace "School" with your institution name throughout the document.

### Add Logo
Add this line in the `<header>` section:
```html
<img src="your-logo.png" alt="School Logo" class="logo">
```
Then add CSS styling for the logo.

### Change Color Scheme
Edit these colors in `styles.css`:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Or use an online color picker and find hex codes you prefer

## Troubleshooting

**Q: RSVPs aren't saving**
A: Check if localStorage is enabled in your browser. Some browsers disable it in private mode.

**Q: Form validation showing errors incorrectly**
A: Clear browser cache and reload. Make sure you're using a modern browser.

**Q: Website looks broken on mobile**
A: Update your browser to the latest version. The site uses modern CSS Grid and Flexbox.

**Q: Can't see admin functions**
A: Open browser DevTools (F12) and check the Console tab.

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript (no dependencies)
- Uses CSS Grid and Flexbox for responsive layout
- Form validation with regex patterns
- Browser localStorage for data persistence
- Mobile-first responsive design

## License

Free to use and modify for your educational institution.

## Support

For issues or questions, check the browser console (F12 → Console) for error messages.

---

**Created for:** Graduation Ceremony Invitations
**Version:** 1.0
**Last Updated:** May 2026
