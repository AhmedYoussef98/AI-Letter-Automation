// Mobile Enhancements for AI Letter Generator
// Add this to your main.js file or create a separate mobile.js file

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileEnhancements();
});

function initializeMobileEnhancements() {
    setupMobileNavigation();
    setupMobileTableConversion();
    setupMobileFilters();
    setupTouchEnhancements();
    setupMobileFormValidation();
}

// Mobile Navigation with Hamburger Menu
function setupMobileNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger menu button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Insert hamburger before nav-links
    navContainer.insertBefore(hamburger, navLinks);
    
    // Toggle menu functionality
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when nav link is clicked
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Hide hamburger on desktop
    function handleResize() {
        if (window.innerWidth > 768) {
            hamburger.style.display = 'none';
            navLinks.style.position = 'static';
            navLinks.style.right = 'auto';
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            hamburger.style.display = 'flex';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
}

// Convert Tables to Mobile Cards
function setupMobileTableConversion() {
    const tableContainer = document.querySelector('.letters-table-container');
    const table = document.querySelector('.letters-table');
    
    if (!table) return;
    
    function convertToMobileCards() {
        if (window.innerWidth <= 768) {
            // Hide table
            table.style.display = 'none';
            
            // Create or update mobile cards
            let mobileGrid = tableContainer.querySelector('.mobile-letters-grid');
            if (!mobileGrid) {
                mobileGrid = document.createElement('div');
                mobileGrid.className = 'mobile-letters-grid';
                tableContainer.appendChild(mobileGrid);
            }
            
            // Clear existing cards
            mobileGrid.innerHTML = '';
            
            // Convert table rows to cards
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 10) {
                    const card = createMobileCard({
                        id: cells[0].textContent.trim(),
                        date: cells[1].textContent.trim(),
                        type: cells[2].textContent.trim(),
                        reviewStatus: cells[3].querySelector('.status-badge').textContent.trim(),
                        sendStatus: cells[4].querySelector('.status-badge').textContent.trim(),
                        recipient: cells[5].textContent.trim(),
                        subject: cells[6].textContent.trim(),
                        reviewer: cells[7].textContent.trim(),
                        notes: cells[8].textContent.trim(),
                        writer: cells[9].textContent.trim(),
                        isHighlighted: row.classList.contains('highlighted-letter')
                    });
                    mobileGrid.appendChild(card);
                }
            });
        } else {
            // Show table on desktop
            table.style.display = 'table';
            const mobileGrid = tableContainer.querySelector('.mobile-letters-grid');
            if (mobileGrid) {
                mobileGrid.style.display = 'none';
            }
        }
    }
    
    function createMobileCard(data) {
        const card = document.createElement('div');
        card.className = `mobile-letter-card ${data.isHighlighted ? 'highlighted-letter' : ''}`;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-id">${data.id}</div>
                <div class="card-date">${data.date}</div>
            </div>
            
            <div class="card-content">
                <div class="card-row">
                    <span class="card-label">النوع:</span>
                    <span class="card-value">${data.type}</span>
                </div>
                
                <div class="card-row">
                    <span class="card-label">المستلم:</span>
                    <span class="card-value">${data.recipient}</span>
                </div>
                
                ${data.writer && data.writer !== '-' ? `
                <div class="card-row">
                    <span class="card-label">الكاتب:</span>
                    <span class="card-value">${data.writer}</span>
                </div>
                ` : ''}
                
                <div class="card-row">
                    <span class="card-label">حالة المراجعة:</span>
                    <span class="card-value">
                        <span class="mobile-status-badge ${getStatusClass(data.reviewStatus)}">${data.reviewStatus}</span>
                    </span>
                </div>
                
                <div class="card-row">
                    <span class="card-label">حالة الإرسال:</span>
                    <span class="card-value">
                        <span class="mobile-status-badge ${getStatusClass(data.sendStatus)}">${data.sendStatus}</span>
                    </span>
                </div>
                
                <div class="card-subject">
                    <div class="card-label">الموضوع:</div>
                    <div style="margin-top: 0.5rem; font-weight: 500;">${data.subject}</div>
                </div>
                
                ${data.reviewer && data.reviewer !== '-' ? `
                <div class="card-row">
                    <span class="card-label">المراجع:</span>
                    <span class="card-value">${data.reviewer}</span>
                </div>
                ` : ''}
                
                ${data.notes && data.notes !== '-' ? `
                <div class="card-row">
                    <span class="card-label">الملاحظات:</span>
                    <span class="card-value">${data.notes}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="card-actions">
                <button class="mobile-action-btn primary" onclick="reviewLetter('${data.id}')" title="مراجعة">
                    <i class="fas fa-eye"></i>
                    مراجعة
                </button>
                <button class="mobile-action-btn secondary" onclick="downloadLetter('${data.id}')" title="تحميل">
                    <i class="fas fa-download"></i>
                    تحميل
                </button>
                <button class="mobile-action-btn danger" onclick="deleteLetter('${data.id}')" title="حذف">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Initial conversion
    convertToMobileCards();
    
    // Handle window resize
    window.addEventListener('resize', convertToMobileCards);
    
    // Re-run conversion when table content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                convertToMobileCards();
            }
        });
    });
    
    if (table.querySelector('tbody')) {
        observer.observe(table.querySelector('tbody'), { 
            childList: true, 
            subtree: true 
        });
    }
}

// Mobile Filters Enhancement
function setupMobileFilters() {
    const filtersSection = document.querySelector('.filters-section');
    if (!filtersSection) return;
    
    function setupMobileFilterToggle() {
        if (window.innerWidth <= 768) {
            // Create toggle button if it doesn't exist
            let toggleButton = filtersSection.querySelector('.mobile-filter-toggle');
            if (!toggleButton) {
                toggleButton = document.createElement('button');
                toggleButton.className = 'mobile-filter-toggle';
                toggleButton.innerHTML = '<i class="fas fa-filter"></i> تصفية النتائج';
                
                // Wrap existing content
                const existingContent = filtersSection.innerHTML;
                filtersSection.innerHTML = '';
                filtersSection.appendChild(toggleButton);
                
                const filtersContent = document.createElement('div');
                filtersContent.className = 'filters-content';
                filtersContent.innerHTML = existingContent;
                filtersSection.appendChild(filtersContent);
                
                // Add clear button
                const clearButton = document.createElement('button');
                clearButton.className = 'mobile-filter-clear';
                clearButton.innerHTML = '<i class="fas fa-times"></i> مسح الفلاتر';
                filtersContent.appendChild(clearButton);
                
                // Toggle functionality
                toggleButton.addEventListener('click', function() {
                    filtersContent.classList.toggle('active');
                    const icon = toggleButton.querySelector('i');
                    if (filtersContent.classList.contains('active')) {
                        icon.className = 'fas fa-times';
                        toggleButton.innerHTML = '<i class="fas fa-times"></i> إغلاق الفلاتر';
                    } else {
                        icon.className = 'fas fa-filter';
                        toggleButton.innerHTML = '<i class="fas fa-filter"></i> تصفية النتائج';
                    }
                });
                
                // Clear filters functionality
                clearButton.addEventListener('click', function() {
                    const inputs = filtersContent.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        if (input.type === 'text') {
                            input.value = '';
                        } else if (input.tagName === 'SELECT') {
                            input.selectedIndex = 0;
                        }
                    });
                    
                    // Trigger filter update
                    const searchInput = filtersContent.querySelector('#searchInput');
                    if (searchInput) {
                        searchInput.dispatchEvent(new Event('input'));
                    }
                    
                    filtersContent.classList.remove('active');
                    toggleButton.innerHTML = '<i class="fas fa-filter"></i> تصفية النتائج';
                });
            }
        } else {
            // Remove mobile filter toggle on desktop
            const toggleButton = filtersSection.querySelector('.mobile-filter-toggle');
            const filtersContent = filtersSection.querySelector('.filters-content');
            
            if (toggleButton && filtersContent) {
                filtersSection.innerHTML = filtersContent.innerHTML.replace('<button class="mobile-filter-clear".*?</button>', '');
            }
        }
    }
    
    setupMobileFilterToggle();
    window.addEventListener('resize', setupMobileFilterToggle);
}

// Touch Enhancements
function setupTouchEnhancements() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .nav-link, .action-icon');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
    
    // Prevent double-tap zoom on certain elements
    const preventDoubleTap = document.querySelectorAll('.action-icon, .mobile-action-btn, .submit-button');
    
    preventDoubleTap.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            element.click();
        });
    });
    
    // Add swipe to delete functionality for mobile cards
    setupSwipeToDelete();
}

// Swipe to Delete for Mobile Cards
function setupSwipeToDelete() {
    let startX, startY, currentX, currentY;
    let isSwipping = false;
    
    document.addEventListener('touchstart', function(e) {
        const card = e.target.closest('.mobile-letter-card');
        if (!card) return;
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipping = false;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const card = e.target.closest('.mobile-letter-card');
        if (!card) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            isSwipping = true;
            
            // Show delete indicator
            if (diffX > 0) { // Swipe left
                card.style.transform = `translateX(-${Math.min(diffX, 100)}px)`;
                card.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            }
        }
    });
    
    document.addEventListener('touchend', function(e) {
        const card = e.target.closest('.mobile-letter-card');
        if (!card || !isSwipping) {
            if (card) {
                card.style.transform = '';
                card.style.backgroundColor = '';
            }
            startX = startY = null;
            return;
        }
        
        const diffX = startX - currentX;
        
        if (diffX > 80) { // Swipe threshold
            // Show delete confirmation
            const cardId = card.querySelector('.card-id').textContent.trim();
            if (confirm('هل تريد حذف هذا الخطاب؟')) {
                deleteLetter(cardId);
            }
        }
        
        // Reset card position
        card.style.transform = '';
        card.style.backgroundColor = '';
        startX = startY = null;
        isSwipping = false;
    });
}

// Mobile Form Validation Enhancements
function setupMobileFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = form.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
    } else if (field.name === 'recipient' && value) {
        // Check for recipient name validation (first and last name)
        if (value.split(' ').length < 2) {
            isValid = false;
            errorMessage = 'يرجى إدخال الاسم الأول والثاني';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('field-error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger)';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.25rem';
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    field.classList.remove('field-error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to get status class (if not already defined)
if (typeof getStatusClass !== 'function') {
    function getStatusClass(status) {
        const statusMap = {
            'جاهز للإرسال': 'status-ready',
            'في الانتظار': 'status-waiting',
            'يحتاج إلى تحسينات': 'status-needs-improvement',
            'مرفوض': 'status-rejected',
            'تم الإرسال': 'status-ready'
        };
        return statusMap[status] || 'status-waiting';
    }
}

// Mobile Loading States
function showMobileLoader(message = 'جاري التحميل...') {
    let loader = document.querySelector('.mobile-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'mobile-loader';
        loader.innerHTML = `
            <div class="mobile-spinner"></div>
            <p class="mobile-loader-text">${message}</p>
        `;
        document.body.appendChild(loader);
        
        // Add mobile loader styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .mobile-loader.active {
                opacity: 1;
                visibility: visible;
            }
            
            .mobile-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .mobile-loader-text {
                color: white;
                margin-top: 1rem;
                font-size: 1rem;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    loader.querySelector('.mobile-loader-text').textContent = message;
    loader.classList.add('active');
    return loader;
}

function hideMobileLoader() {
    const loader = document.querySelector('.mobile-loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

// Add CSS for shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .field-error {
        border-color: var(--danger) !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(shakeStyle);

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showMobileLoader,
        hideMobileLoader,
        setupMobileNavigation,
        setupMobileTableConversion,
        setupMobileFilters,
        setupTouchEnhancements
    };
}
// ADD THIS TO YOUR mobile.js FILE FOR DEBUGGING

// SIMPLIFIED HAMBURGER MENU FIX
// Replace your existing setupMobileNavigation function with this:

function setupMobileNavigation() {
    console.log('🔧 Setting up mobile navigation...');
    
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) {
        console.error('❌ Navigation elements not found!');
        return;
    }
    
    // Find or create hamburger
    let hamburger = document.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        document.body.appendChild(hamburger); // Append to body instead of nav-container
        console.log('✅ Hamburger button created and added to body');
    }
    
    // Find or create overlay
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        console.log('✅ Overlay created');
    }
    
    // CRITICAL: Remove any existing event listeners
    hamburger.replaceWith(hamburger.cloneNode(true));
    hamburger = document.querySelector('.hamburger');
    
    // Simple toggle function
    function toggleMenu() {
        console.log('🍔 Toggle menu called');
        
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            // Close menu
            console.log('❌ Closing menu...');
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        } else {
            // Open menu
            console.log('✅ Opening menu...');
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('nav-open');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Add multiple event types to hamburger for better compatibility
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🍔 Hamburger CLICKED');
        toggleMenu();
    });
    
    hamburger.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('👆 Hamburger TOUCHED');
    });
    
    hamburger.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('👆 Hamburger TOUCH END');
        toggleMenu();
    });
    
    // Close menu when overlay clicked
    overlay.addEventListener('click', function(e) {
        console.log('🌫️ Overlay clicked');
        toggleMenu();
    });
    
    // Close menu when nav link clicked
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
            console.log('🔗 Nav link clicked - closing menu');
            setTimeout(() => toggleMenu(), 100); // Small delay for UX
        }
    });
    
    // Test hamburger visibility and clickability
    function testHamburger() {
        const rect = hamburger.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const computedStyle = window.getComputedStyle(hamburger);
        
        console.log('🔍 Hamburger test:', {
            visible: isVisible,
            width: rect.width,
            height: rect.height,
            zIndex: computedStyle.zIndex,
            position: computedStyle.position,
            pointerEvents: computedStyle.pointerEvents,
            display: computedStyle.display
        });
        
        // Make hamburger flash to show its location
        hamburger.style.backgroundColor = 'red';
        setTimeout(() => {
            hamburger.style.backgroundColor = '';
        }, 500);
    }
    
    // Run test after setup
    setTimeout(testHamburger, 1000);
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            hamburger.style.display = 'none';
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        } else {
            hamburger.style.display = 'flex';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    console.log('✅ Mobile navigation setup complete!');
    
    // Add click test area around hamburger
    document.addEventListener('click', function(e) {
        const rect = hamburger.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        if (clickX >= rect.left && clickX <= rect.right && 
            clickY >= rect.top && clickY <= rect.bottom) {
            console.log('🎯 Click detected in hamburger area!');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupMobileNavigation);
