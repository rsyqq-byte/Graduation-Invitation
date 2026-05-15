// RSVP Form Handling
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwxGzjzdpxH09wDd76qzRx0Y4IPjHAT0B4JqL0YA_O-I9JZv8i6Zb-aCss9Y079G0E/exec';
 
let isSubmitting = false; // Mencegah spam tombol kirim
 
document.addEventListener('DOMContentLoaded', function() {
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
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
 
    const form = document.getElementById('rsvpForm');
 
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
 
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
 
// Set tombol loading
function setButtonLoading(isLoading) {
    const btn = document.querySelector('.submit-btn');
    if (!btn) return;
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `
            <span style="display:inline-flex; align-items:center; justify-content:center; gap:8px;">
                <svg style="animation: spin 1s linear infinite; width:18px; height:18px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style="opacity:.25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
                    <path style="opacity:.75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 10h-2A8 8 0 014 12z"/>
                </svg>
                Mengirim...
            </span>
        `;
        btn.style.opacity = '0.8';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Kirim Konfirmasi Kehadiran';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}
 
// Handle Form Submission
async function handleFormSubmit() {
    // Cegah spam
    if (isSubmitting) return;
 
    const form = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    
    formMessage.textContent = '';
    formMessage.classList.remove('success', 'error');
 
    if (!validateName()) {
        formMessage.textContent = 'Mohon masukkan nama lengkap Anda.';
        formMessage.classList.add('error');
        return;
    }
 
    // Aktifkan loading
    isSubmitting = true;
    setButtonLoading(true);
 
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        relationship: formData.get('relationship'),
        studentName: formData.get('studentName'),
        attendance: formData.get('attendance'),
        message: formData.get('message'),
        submittedAt: new Date().toISOString()
    };
 
    // Simpan ke localStorage
    try {
        let responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        responses.push(data);
        localStorage.setItem('graduationRSVPs', JSON.stringify(responses));
    } catch (error) {
        console.error('Error saving RSVP locally:', error);
    }
 
    const submittedName = data.fullName;
    const isAttending = data.attendance === 'Yes';
 
    const onlineResult = await sendRSVPDataOnline(data);
 
    // Nonaktifkan loading
    setButtonLoading(false);
    isSubmitting = false;
 
    if (onlineResult.ok) {
        showResultMessage('online', '', submittedName, isAttending);
    } else {
        showResultMessage('offline', onlineResult.reason, submittedName, isAttending);
    }
    
    // Reset form
    form.reset();
    document.getElementById('fullName').style.borderColor = '#e0e0e0';
}
 
// Show result message
function showResultMessage(status = 'online', reason = '', submittedName = '', isAttending = false) {
    const formMessage = document.getElementById('formMessage');
 
    // Undangan hanya muncul jika memilih hadir (Yes)
    const undanganHTML = isAttending ? `
        <div style="margin-top: 16px; text-align: center;">
            <p style="font-weight: bold; margin-bottom: 10px; font-size: 15px;">📩 Silakan Download Undangan Anda:</p>
            <img 
                src="img/undangan.jpg" 
                alt="Undangan Wisuda" 
                style="
                    width: 100%;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
                    display: block;
                "
            >
            <a 
                href="img/undangan.jpg" 
                download="Undangan_Wisuda.jpg" 
                style="
                    display: block;
                    text-align: center;
                    background: linear-gradient(135deg, #7c3aed, #a855f7);
                    color: white;
                    padding: 13px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 15px;
                    letter-spacing: 0.3px;
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
                "
            >⬇️ Download Undangan</a>
        </div>
    ` : `
        <div style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 14px;">
            😔 Kami berharap dapat bertemu Anda di lain kesempatan.
        </div>
    `;
 
    if (status === 'online') {
        formMessage.innerHTML = `
            <p>✓ Terima kasih, <strong>${submittedName}</strong>!</p>
            <p>Data Anda telah tersimpan secara online.</p>
            ${undanganHTML}
        `;
        formMessage.classList.add('success');
    } else {
        formMessage.innerHTML = `
            <p>⚠️ Terima kasih, <strong>${submittedName}</strong>.</p>
            <p>Data Anda tersimpan sebagai cadangan lokal.</p>
            <p><strong>Alasan:</strong> ${reason || 'Tidak dapat menghubungi server online.'}</p>
            ${undanganHTML}
        `;
        formMessage.classList.add('error');
    }
 
    setTimeout(() => {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}
 
// Send RSVP data to online endpoint
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
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        });
 
        console.log('Online RSVP berhasil dikirim.');
        return { ok: true };
 
    } catch (error) {
        console.error('Error sending RSVP online:', error);
        return { ok: false, reason: error.message || 'Kesalahan jaringan saat mengirim data.' };
    }
}
 
function sendRSVPDataOnlineByForm(data) {
    return new Promise((resolve) => {
        const iframeName = 'rsvpEndpointFrame';
        let iframe = document.getElementById(iframeName);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = iframeName;
            iframe.id = iframeName;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
 
        const form = document.createElement('form');
        form.action = RSVP_ENDPOINT;
        form.method = 'POST';
        form.target = iframeName;
        form.style.display = 'none';
 
        Object.entries(data).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value || '';
            form.appendChild(input);
        });
 
        document.body.appendChild(form);
        form.submit();
 
        setTimeout(() => {
            document.body.removeChild(form);
            resolve(true);
        }, 1500);
    });
}
 
// CSS animasi spinner
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);
 
// Optional: Function to view all RSVPs (for admin purposes)
function viewAllRSVPs() {
    try {
        const responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        console.table(responses);
        console.log(`Total RSVPs: ${responses.length}`);
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
 
function clearAllRSVPs() {
    if (confirm('Are you sure you want to clear all RSVPs? This action cannot be undone.')) {
        localStorage.removeItem('graduationRSVPs');
        console.log('All RSVPs have been cleared.');
    }
}
 
function exportRSVPsAsCSV() {
    try {
        const responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        if (responses.length === 0) {
            alert('No RSVPs to export.');
            return;
        }
        const headers = Object.keys(responses[0]);
        let csv = headers.join(',') + '\n';
        responses.forEach(response => {
            const row = headers.map(header => {
                const value = response[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            });
            csv += row.join(',') + '\n';
        });
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
 
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d\-\s\+\(\)]/g, '');
        });
    }
});
 
window.RSVPAdmin = {
    viewAll: viewAllRSVPs,
    clear: clearAllRSVPs,
    export: exportRSVPsAsCSV
};
 
console.log('RSVP Management Functions Available:');
console.log('Use RSVPAdmin.viewAll() to see all RSVPs');
console.log('Use RSVPAdmin.export() to export RSVPs as CSV');
console.log('Use RSVPAdmin.clear() to clear all RSVPs');
