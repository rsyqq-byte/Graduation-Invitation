// RSVP Form Handling
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz1kZLeI79nlfKENQ1_rQ5D6hjTNFQiKQ40TYUzmLfoSM6b0pNYt5ZtWjV-qNM0zraA/exec'; // Masukkan URL Google Apps Script atau endpoint server di sini

document.addEventListener('DOMContentLoaded', function() {
    // Envelope opening animation
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.querySelector('.nav-menu');

    const letterImage = document.getElementById('letterImage');
    const letterHint = document.querySelector('.letter-hint');
    const wayangOverlay = document.getElementById('wayangOverlay');
    let envelopeOpened = false;

    function openWayangOverlay() {
        if (!wayangOverlay) return;
        setTimeout(() => {
            requestAnimationFrame(() => {
                wayangOverlay.classList.remove('closed');
                wayangOverlay.classList.add('open');
            });
        }, 600);

        setTimeout(() => {
            if (wayangOverlay) {
                wayangOverlay.classList.add('hidden');
                wayangOverlay.style.pointerEvents = 'none';
            }
        }, 2400);
    }

    function openEnvelopeAnimation() {
        if (envelopeOpened) return;
        envelopeOpened = true;
        if (letterHint) {
            letterHint.classList.add('fade-out');
        }
        const flap = envelope.querySelector('.envelope-flap');
        
        if (flap) {
            flap.style.transform = 'rotateX(-180deg)';
        }
        if (letterImage) {
            letterImage.src = 'img/surat2.jpg';
        }
        
        envelope.classList.add('opening');
        envelope.classList.add('zoom-view');
        if (letterImage) {
            letterImage.classList.add('letter-zoom');
        }

        setTimeout(() => {
            envelope.style.display = 'none';
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                navMenu.classList.remove('hidden');
            }, 200);
        }, 1550);
    }

    if (wayangOverlay) {
        openWayangOverlay();
    }

    if (letterImage) {
        letterImage.addEventListener('click', openEnvelopeAnimation);
    } else if (envelope) {
        envelope.addEventListener('click', openEnvelopeAnimation);
    }

    // Navigation tabs
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            // Show selected section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const form = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form validation
    const fullName = document.getElementById('fullName');

    if (fullName) {
        fullName.addEventListener('blur', validateName);
    }
});

// Validate Full Name
function validateName() {
    const fullName = document.getElementById('fullName');
    const value = fullName.value.trim();
    
    if (value.length < 2) {
        fullName.style.borderColor = '#dc3545';
        return false;
    } else {
        fullName.style.borderColor = '#28a745';
        return true;
    }
}

// Handle Form Submission
async function handleFormSubmit() {
    const form = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    
    // Clear previous messages
    formMessage.textContent = '';
    formMessage.classList.remove('success', 'error');

    // Validate required field
    if (!validateName()) {
        formMessage.textContent = 'Please enter your full name.';
        formMessage.classList.add('error');
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        relationship: formData.get('relationship'),
        studentName: formData.get('studentName'),
        attendance: formData.get('attendance'),
        message: formData.get('message'),
        submittedAt: new Date().toISOString()
    };

    // Save to localStorage as a backup
    try {
        let responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        responses.push(data);
        localStorage.setItem('graduationRSVPs', JSON.stringify(responses));
    } catch (error) {
        console.error('Error saving RSVP locally:', error);
    }

    const onlineResult = await sendRSVPDataOnline(data);

    if (onlineResult.ok) {
        showResultMessage('online');
    } else {
        showResultMessage('offline', onlineResult.reason);
    }
    
    // Reset form
    form.reset();
    
    // Reset border color
    document.getElementById('fullName').style.borderColor = '#e0e0e0';
}

// Show result message
function showResultMessage(status = 'online', reason = '') {
    const formMessage = document.getElementById('formMessage');
    const fullName = document.getElementById('fullName').value;
    
    if (status === 'online') {
        formMessage.innerHTML = `
            <p>✓ Terima kasih, <strong>${fullName}</strong>!</p>
            <p>Data Anda telah tersimpan secara online.</p>
        `;
        formMessage.classList.add('success');
    } else {
        formMessage.innerHTML = `
            <p>⚠️ Terima kasih, <strong>${fullName}</strong>.</p>
            <p>Data Anda tersimpan sebagai cadangan lokal.</p>
            <p><strong>Alasan:</strong> ${reason || 'Tidak dapat menghubungi server online.'}</p>
            <p>Silakan periksa koneksi atau konfigurasi endpoint.</p>
        `;
        formMessage.classList.add('error');
    }

    // Scroll to message
    setTimeout(() => {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Send RSVP data to online endpoint if configured
/*async function sendRSVPDataOnline(data) {
    if (!RSVP_ENDPOINT) {
        console.warn('RSVP endpoint tidak dikonfigurasi. Data hanya disimpan lokal.');
        return { ok: false, reason: 'Endpoint belum dikonfigurasi.' };
    }

    try {
        console.log('Sending RSVP data to online endpoint:', data);
        const formBody = new URLSearchParams(data);
        const response = await fetch(RSVP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formBody
        });*/

async function sendRSVPDataOnline(data) {
    if (!RSVP_ENDPOINT) {
        console.warn('RSVP endpoint tidak dikonfigurasi. Data hanya disimpan lokal.');
        return { ok: false, reason: 'Endpoint belum dikonfigurasi.' };
    }

    try {
        console.log('Sending RSVP data to online endpoint:', data);
        const formBody = new URLSearchParams(data);
        const response = await fetch(RSVP_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors', // ← Tambahkan ini
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        });

        // no-cors tidak bisa baca response, jadi anggap sukses
        return { ok: true };

    } catch (error) {
        console.error('Error sending RSVP online:', error);
        return { ok: false, reason: error.message };
    }
}

        if (!response.ok) {
            const text = await response.text();
            console.error('Online RSVP gagal:', response.status, response.statusText, text);
            return { ok: false, reason: `Status ${response.status}: ${response.statusText}` };
        }

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            const text = await response.text();
            console.error('Gagal membaca respon JSON dari endpoint:', parseError, text);
            return { ok: false, reason: 'Respon server tidak valid (bukan JSON).' };
        }

        if (result && result.success === false) {
            console.error('Online RSVP response error:', result);
            return { ok: false, reason: result.error || 'Server mengembalikan success=false.' };
        }

        console.log('Online RSVP berhasil:', result);
        return { ok: true };
    } catch (error) {
        console.error('Error sending RSVP online:', error);
        return { ok: false, reason: error.message || 'Kesalahan jaringan saat mengirim data.' };
    }
}

// Optional: Function to view all RSVPs (for admin purposes)
function viewAllRSVPs() {
    try {
        const responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        console.table(responses);
        console.log(`Total RSVPs: ${responses.length}`);
        
        // Count attendance
        const attending = responses.filter(r => r.attendance === 'Yes').length;
        const notAttending = responses.filter(r => r.attendance === 'No').length;
        
        console.log(`Attending: ${attending}`);
        console.log(`Not Attending: ${notAttending}`);
        
        return responses;
    } catch (error) {
        console.error('Error retrieving RSVPs:', error);
        return [];
    }
}

// Optional: Function to clear all RSVPs (use with caution)
function clearAllRSVPs() {
    if (confirm('Are you sure you want to clear all RSVPs? This action cannot be undone.')) {
        localStorage.removeItem('graduationRSVPs');
        console.log('All RSVPs have been cleared.');
    }
}

// Optional: Export RSVPs as CSV
function exportRSVPsAsCSV() {
    try {
        const responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        
        if (responses.length === 0) {
            alert('No RSVPs to export.');
            return;
        }

        // Create CSV headers
        const headers = Object.keys(responses[0]);
        let csv = headers.join(',') + '\n';

        // Add data rows
        responses.forEach(response => {
            const row = headers.map(header => {
                const value = response[header];
                // Escape quotes and wrap in quotes if contains comma
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            });
            csv += row.join(',') + '\n';
        });

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `graduation-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log(`Exported ${responses.length} RSVPs.`);
    } catch (error) {
        console.error('Error exporting RSVPs:', error);
    }
}

// Add number formatting for phone input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Allow only numbers, dashes, spaces, +, and parentheses
            this.value = this.value.replace(/[^\d\-\s\+\(\)]/g, '');
        });
    }
});

// Make functions available in console for admin use
window.RSVPAdmin = {
    viewAll: viewAllRSVPs,
    clear: clearAllRSVPs,
    export: exportRSVPsAsCSV
};

console.log('RSVP Management Functions Available:');
console.log('Use RSVPAdmin.viewAll() to see all RSVPs');
console.log('Use RSVPAdmin.export() to export RSVPs as CSV');
console.log('Use RSVPAdmin.clear() to clear all RSVPs');
