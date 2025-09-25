// Mobile Enhancements for AI Letter Generator
// Complete mobile.js file

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileEnhancements();
});

function initializeMobileEnhancements() {
    console.log('🚀 Initializing mobile enhancements...');
    setupMobileNavigation();
    setupMobileTableConversion();
    setupMobileFilters();
    setupTouchEnhancements();
    setupMobileFormValidation();
}

// Mobile Navigation with Hamburger Menu
function setupMobileNavigation() {
    console.log('🔧 Setting up mobile navigation...');
    
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) {
        console.error('❌ Navigation elements not found!');
        console.log('Available elements:', {
            navContainer: !!navContainer,
            navLinks: !!navLinks,
            allNavs: document.querySelectorAll('nav').length,
            allUls: document.querySelectorAll('ul').length
        });
        return;
    }

    // Remove any existing hamburger
    const existingHamburger = document.querySelector('.hamburger');
    if (existingHamburger) {
        existingHamburger.remove();
    }

    // Create hamburger menu button with inline styles for immediate visibility
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    // Apply critical styles directly to ensure visibility
    hamburger.style.cssText = `
        display: flex !important;
        flex-direction: column !important;
        position: fixed !important;
        top: 15px !important;
        right: 15px !important;
        z-index: 99999 !important;
        cursor: pointer !important;
        padding: 12px !important;
        background-color: rgba(0, 166, 81, 0.95) !important;
        border-radius: 6px !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
        justify-content: center !important;
        align-items: center !important;
        width: 50px !important;
        height: 50px !important;
        pointer-events: auto !important;
        touch-action: manipulation !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
    `;
    
    // Style the hamburger lines
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.cssText = `
            width: 25px !important;
            height: 3px !important;
            background-color: white !important;
            display: block !important;
            margin: 3px 0 !important;
            border-radius: 2px !important;
            transition: all 0.3s ease !important;
            transform-origin: center !important;
        `;
    });
    
    // Add hamburger to body
    document.body.appendChild(hamburger);
    console.log('✅ Hamburger button created and added to body');

    // Create or find overlay
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: 9998 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.3s ease !important;
            pointer-events: none !important;
        `;
        document.body.appendChild(overlay);
        console.log('✅ Overlay created');
    }

    // Style nav-links for mobile
    navLinks.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: -100% !important;
        width: 80% !important;
        max-width: 300px !important;
        height: 100vh !important;
        background-color: var(--card-light, #ffffff) !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        align-items: stretch !important;
        padding: 80px 0 20px 0 !important;
        transition: right 0.3s ease !important;
        z-index: 9999 !important;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2) !important;
        pointer-events: none !important;
        overflow-y: auto !important;
    `;

    // Navigation state management
    let isMenuOpen = false;
    
    function toggleMenu() {
        console.log('🍔 Toggle menu called, current state:', isMenuOpen);
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        console.log('✅ Opening menu...');
        isMenuOpen = true;
        
        // Update hamburger
        hamburger.classList.add('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        
        // Show navigation
        navLinks.style.right = '0';
        navLinks.style.pointerEvents = 'auto';
        navLinks.classList.add('active');
        
        // Show overlay
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        overlay.style.pointerEvents = 'auto';
        overlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('nav-open');
        
        // Style individual nav links for mobile
        const navLinksElements = navLinks.querySelectorAll('.nav-link');
        navLinksElements.forEach(link => {
            link.style.cssText = `
                padding: 15px 20px !important;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                display: flex !important;
                align-items: center !important;
                font-size: 16px !important;
                min-height: 50px !important;
                width: 100% !important;
                box-sizing: border-box !important;
                color: var(--text-light, #333) !important;
                text-decoration: none !important;
                transition: background-color 0.3s ease !important;
            `;
            
            // Add hover effect
            link.addEventListener('mouseenter', () => {
                link.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.backgroundColor = 'transparent';
            });
        });
    }
    
    function closeMenu() {
        console.log('❌ Closing menu...');
        isMenuOpen = false;
        
        // Reset hamburger
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        
        // Hide navigation
        navLinks.style.right = '-100%';
        navLinks.style.pointerEvents = 'none';
        navLinks.classList.remove('active');
        
        // Hide overlay
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
    }

    // Event listeners with better mobile support
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🍔 Hamburger CLICKED');
        toggleMenu();
    });

    hamburger.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('👆 Hamburger TOUCH START');
        hamburger.style.transform = 'scale(0.95)';
    });

    hamburger.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('👆 Hamburger TOUCH END');
        hamburger.style.transform = 'scale(1)';
        toggleMenu();
    });

    // Close menu when overlay clicked
    overlay.addEventListener('click', function(e) {
        console.log('🌫️ Overlay clicked - closing menu');
        closeMenu();
    });

    // Close menu when nav link clicked
    navLinks.addEventListener('click', function(e) {
        const clickedLink = e.target.closest('.nav-link');
        if (clickedLink) {
            console.log('🔗 Nav link clicked:', clickedLink.textContent.trim());
            setTimeout(() => closeMenu(), 150); // Small delay for UX
        }
    });

    // Handle window resize
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            console.log('📱 Mobile view - showing hamburger');
            hamburger.style.display = 'flex';
        } else {
            console.log('💻 Desktop view - hiding hamburger');
            hamburger.style.display = 'none';
            closeMenu();
            
            // Reset nav-links for desktop
            navLinks.style.cssText = '';
            navLinks.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Test hamburger functionality
    setTimeout(() => {
        testHamburgerFunctionality();
    }, 1000);
    
    function testHamburgerFunctionality() {
        const rect = hamburger.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(hamburger);
        
        console.log('🔍 Hamburger test:', {
            visible: rect.width > 0 && rect.height > 0,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            zIndex: computedStyle.zIndex,
            position: computedStyle.position,
            display: computedStyle.display,
            pointerEvents: computedStyle.pointerEvents,
            backgroundColor: computedStyle.backgroundColor
        });
        
        // Visual test - make hamburger flash
        const originalBg = hamburger.style.backgroundColor;
        hamburger.style.backgroundColor = 'red';
        setTimeout(() => {
            hamburger.style.backgroundColor = originalBg;
        }, 1000);
        
        console.log('🔴 Hamburger should flash red for 1 second');
    }

    console.log('✅ Mobile navigation setup complete!');
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
                mobileGrid.style.cssText = `
                    display: grid;
                    gap: 1rem;
                    padding: 1rem;
                `;
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
                        reviewStatus: cells[3].querySelector('.status-badge')?.textContent.trim() || cells[3].textContent.trim(),
                        sendStatus: cells[4].querySelector('.status-badge')?.textContent.trim() || cells[4].textContent.trim(),
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
        
        card.style.cssText = `
            background-color: var(--card-light, #ffffff);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border-light, #e0e0e0);
            transition: all 0.3s ease;
        `;
        
        card.innerHTML = `
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light, #e0e0e0);">
                <div class="card-id" style="font-weight: 700; color: var(--primary-color, #00a651); font-size: 1.1rem;">${data.id}</div>
                <div class="card-date" style="font-size: 0.85rem; color: #666; text-align: left; direction: ltr;">${data.date}</div>
            </div>
            
            <div class="card-content" style="display: grid; gap: 0.75rem; margin-bottom: 1rem;">
                <div class="card-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="card-label" style="font-weight: 600; color: var(--text-light, #333); font-size: 0.9rem; min-width: 80px;">النوع:</span>
                    <span class="card-value" style="flex: 1; text-align: left; font-size: 0.9rem; color: var(--text-light, #333);">${data.type}</span>
                </div>
                
                <div class="card-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="card-label" style="font-weight: 600; color: var(--text-light, #333); font-size: 0.9rem; min-width: 80px;">المستلم:</span>
                    <span class="card-value" style="flex: 1; text-align: left; font-size: 0.9rem; color: var(--text-light, #333);">${data.recipient}</span>
                </div>
                
                ${data.writer && data.writer !== '-' ? `
                <div class="card-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="card-label" style="font-weight: 600; color: var(--text-light, #333); font-size: 0.9rem; min-width: 80px;">الكاتب:</span>
                    <span class="card-value" style="flex: 1; text-align: left; font-size: 0.9rem; color: var(--text-light, #333);">${data.writer}</span>
                </div>
                ` : ''}
                
                <div class="card-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="card-label" style="font-weight: 600; color: var(--text-light, #333); font-size: 0.9rem; min-width: 80px;">حالة المراجعة:</span>
                    <span class="card-value" style="flex: 1; text-align: left; font-size: 0.9rem; color: var(--text-light, #333);">
                        <span class="mobile-status-badge ${getStatusClass(data.reviewStatus)}" style="padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.75rem; font-weight: 600; white-space: nowrap;">${data.reviewStatus}</span>
                    </span>
                </div>
                
                <div class="card-subject" style="grid-column: 1 / -1; background-color: rgba(0, 166, 81, 0.05); padding: 0.75rem; border-radius: 6px; border-right: 3px solid var(--primary-color, #00a651);">
                    <div class="card-label" style="font-weight: 600; color: var(--text-light, #333); font-size: 0.9rem;">الموضوع:</div>
                    <div style="margin-top: 0.5rem; font-weight: 500;">${data.subject}</div>
                </div>
            </div>
            
            <div class="card-actions" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light, #e0e0e0);">
                <button class="mobile-action-btn primary" onclick="reviewLetter('${data.id}')" style="flex: 1; min-width: 80px; padding: 0.75rem 1rem; border-radius: 8px; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s ease; background-color: var(--primary-color, #00a651); color: white;">
                    <i class="fas fa-eye"></i>
                    مراجعة
                </button>
                <button class="mobile-action-btn secondary" onclick="downloadLetter('${data.id}')" style="flex: 1; min-width: 80px; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s ease; background-color: transparent; color: var(--secondary-color, #0066cc); border: 1px solid var(--secondary-color, #0066cc);">
                    <i class="fas fa-download"></i>
                    تحميل
                </button>
                <button class="mobile-action-btn danger" onclick="deleteLetter('${data.id}')" style="flex: 1; min-width: 80px; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s ease; background-color: transparent; color: var(--danger, #dc3545); border: 1px solid var(--danger, #dc3545);">
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
                toggleButton.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background-color: var(--primary-color, #00a651);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 1rem;
                    width: 100%;
                    min-height: 56px;
                `;
                
                // Wrap existing content
                const existingContent = filtersSection.innerHTML;
                filtersSection.innerHTML = '';
                filtersSection.appendChild(toggleButton);
                
                const filtersContent = document.createElement('div');
                filtersContent.className = 'filters-content';
                filtersContent.innerHTML = existingContent;
                filtersContent.style.display = 'none';
                filtersSection.appendChild(filtersContent);
                
                // Add clear button
                const clearButton = document.createElement('button');
                clearButton.className = 'mobile-filter-clear';
                clearButton.innerHTML = '<i class="fas fa-times"></i> مسح الفلاتر';
                clearButton.style.cssText = `
                    background-color: transparent;
                    color: var(--danger, #dc3545);
                    border: 1px solid var(--danger, #dc3545);
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-height: 44px;
                    margin-top: 1rem;
                `;
                filtersContent.appendChild(clearButton);
                
                // Toggle functionality
                toggleButton.addEventListener('click', function() {
                    const isActive = filtersContent.style.display === 'flex';
                    if (isActive) {
                        filtersContent.style.display = 'none';
                        toggleButton.innerHTML = '<i class="fas fa-filter"></i> تصفية النتائج';
                    } else {
                        filtersContent.style.display = 'flex';
                        filtersContent.style.flexDirection = 'column';
                        filtersContent.style.gap = '1rem';
                        toggleButton.innerHTML = '<i class="fas fa-times"></i> إغلاق الفلاتر';
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
                    
                    filtersContent.style.display = 'none';
                    toggleButton.innerHTML = '<i class="fas fa-filter"></i> تصفية النتائج';
                });
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
    errorElement.style.cssText = `
        color: var(--danger, #dc3545);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .field-error {
        border-color: var(--danger, #dc3545) !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    .status-ready {
        background-color: rgba(40, 167, 69, 0.2);
        color: var(--success, #28a745);
    }
    
    .status-waiting {
        background-color: rgba(255, 165, 0, 0.2);
        color: var(--warning, #ffa500);
    }
    
    .status-needs-improvement {
        background-color: rgba(220, 53, 69, 0.2);
        color: var(--danger, #dc3545);
    }
    
    .status-rejected {
        background-color: rgba(220, 53, 69, 0.3);
        color: var(--danger, #dc3545);
    }
`;
document.head.appendChild(style);

console.log('✅ Mobile.js loaded successfully!');

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupMobileNavigation,
        setupMobileTableConversion,
        setupMobileFilters,
        setupTouchEnhancements
    };
}

// ============================================
// NAVIGATION CLICK FIX - Add to end of mobile.js
// ============================================

// Enhanced navigation link click handling
function fixNavigationClicks() {
    console.log('🔧 Fixing navigation clicks...');
    
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (!navLinks || !hamburger) {
        console.error('❌ Navigation elements not found for click fix');
        return;
    }
    
    // Remove all existing event listeners and re-add them
    const navLinkElements = navLinks.querySelectorAll('.nav-link');
    console.log(`🔗 Found ${navLinkElements.length} nav links to fix`);
    
    navLinkElements.forEach((link, index) => {
        // Clone the element to remove all existing event listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add enhanced click handling
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`✅ Nav link ${index + 1} clicked:`, newLink.textContent.trim());
            
            // Close menu immediately
            closeMenuImmediate();
            
            // Navigate after a small delay
            setTimeout(() => {
                const href = newLink.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            }, 200);
        });
        
        // Add touch handling
        newLink.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`👆 Nav link ${index + 1} touched:`, newLink.textContent.trim());
            
            // Visual feedback
            newLink.style.backgroundColor = 'rgba(0, 166, 81, 0.2)';
            setTimeout(() => {
                newLink.style.backgroundColor = '';
            }, 150);
            
            // Close menu and navigate
            closeMenuImmediate();
            
            setTimeout(() => {
                const href = newLink.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            }, 200);
        });
        
        // Add hover effects for desktop
        newLink.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) return; // Only on mobile
            this.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
        });
        
        newLink.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) return; // Only on mobile
            this.style.backgroundColor = '';
        });
        
        // Style the link to ensure it's clickable
        newLink.style.cssText = `
            display: flex !important;
            align-items: center !important;
            padding: 15px 20px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
            font-size: 16px !important;
            min-height: 50px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            color: var(--text-light, #333) !important;
            text-decoration: none !important;
            transition: background-color 0.3s ease !important;
            position: relative !important;
            z-index: 10000 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
            background-color: transparent !important;
        `;
        
        console.log(`✅ Fixed nav link ${index + 1}`);
    });
    
    // Function to close menu immediately
    function closeMenuImmediate() {
        console.log('❌ Closing menu immediately...');
        
        // Update hamburger
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        
        // Hide navigation
        navLinks.style.right = '-100%';
        navLinks.style.pointerEvents = 'none';
        navLinks.classList.remove('active');
        
        // Hide overlay
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            overlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
    }
    
    // Test navigation links
    setTimeout(() => {
        testNavigationLinks();
    }, 1000);
    
    function testNavigationLinks() {
        console.log('🧪 Testing navigation links...');
        
        navLinkElements.forEach((link, index) => {
            const rect = link.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(link);
            
            console.log(`🔗 Nav link ${index + 1} test:`, {
                text: link.textContent.trim(),
                visible: rect.width > 0 && rect.height > 0,
                width: rect.width,
                height: rect.height,
                zIndex: computedStyle.zIndex,
                pointerEvents: computedStyle.pointerEvents,
                position: computedStyle.position,
                clickable: rect.width > 0 && rect.height > 0 && computedStyle.pointerEvents !== 'none'
            });
            
            // Visual test - flash the link
            const originalBg = link.style.backgroundColor;
            link.style.backgroundColor = 'yellow';
            setTimeout(() => {
                link.style.backgroundColor = originalBg;
            }, 500 + (index * 200)); // Stagger the flashes
        });
        
        console.log('🟡 Navigation links should flash yellow one by one');
    }
    
    console.log('✅ Navigation click fix complete!');
}

// Call the fix function when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixNavigationClicks);
} else {
    fixNavigationClicks();
}

// Also fix navigation when the mobile navigation is set up
const originalSetupMobileNavigation = setupMobileNavigation;
setupMobileNavigation = function() {
    originalSetupMobileNavigation.call(this);
    setTimeout(fixNavigationClicks, 500); // Fix after setup
};

// Add a test function you can call from console
window.testNavigation = function() {
    console.log('🧪 Manual navigation test...');
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        console.log(`Testing link ${index + 1}:`, link.textContent.trim());
        
        // Simulate click
        link.style.backgroundColor = 'red';
        setTimeout(() => {
            link.style.backgroundColor = '';
        }, 1000);
    });
    
    console.log('🔴 All navigation links should flash red');
    console.log('💡 Try clicking them now!');
};

console.log('✅ Navigation click fix loaded!');
console.log('💡 You can test navigation by typing: window.testNavigation() in console');
