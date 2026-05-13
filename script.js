// RSVP Form Handling
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
function handleFormSubmit() {
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

    // Save to localStorage
    try {
        let responses = JSON.parse(localStorage.getItem('graduationRSVPs')) || [];
        responses.push(data);
        localStorage.setItem('graduationRSVPs', JSON.stringify(responses));

        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset border color
        document.getElementById('fullName').style.borderColor = '#e0e0e0';

    } catch (error) {
        console.error('Error saving RSVP:', error);
        formMessage.textContent = 'An error occurred. Please try again.';
        formMessage.classList.add('error');
    }
}

// Show Success Message
function showSuccessMessage() {
    const formMessage = document.getElementById('formMessage');
    const fullName = document.getElementById('fullName').value;
    
    formMessage.innerHTML = `
        <p>✓ Thank you, <strong>${fullName}</strong>!</p>
        <p>Your RSVP has been received. We look forward to seeing you at the graduation ceremony.</p>
    `;
    formMessage.classList.add('success');

    // Scroll to message
    setTimeout(() => {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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
