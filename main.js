// Optimized Main.js with Performance Improvements
// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) {
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// OPTIMIZATION: Enhanced Letter History Functions with Performance Monitoring
async function loadLetterHistory() {
    console.log('🚀 Loading letter history with optimizations...');
    
    // Show quick stats while loading
    showQuickStats();
    
    // Use progressive loading for better UX
    await loadLetterHistoryProgressive();
    
    // Update quick stats with real data
    updateQuickStats();
}

function showQuickStats() {
    const container = document.querySelector('.main-container');
    const existingStats = document.querySelector('.quick-actions');
    
    if (!existingStats && container) {
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        quickActions.innerHTML = `
            <div class="quick-stats">
                <div class="stat-item">
                    <div class="stat-value" id="totalLetters">--</div>
                    <div class="stat-label">إجمالي الخطابات</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="pendingReview">--</div>
                    <div class="stat-label">في انتظار المراجعة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="readyToSend">--</div>
                    <div class="stat-label">جاهز للإرسال</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="thisMonth">--</div>
                    <div class="stat-label">هذا الشهر</div>
                </div>
            </div>
            <div class="quick-actions-buttons">
                <button class="quick-action-btn refresh" onclick="refreshLetterCache()">
                    <i class="fas fa-sync-alt"></i>
                    تحديث
                </button>
                <button class="quick-action-btn export" onclick="exportLettersToCSV()">
                    <i class="fas fa-download"></i>
                    تصدير
                </button>
            </div>
        `;
        
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.insertAdjacentElement('afterend', quickActions);
        }
    }
}

function updateQuickStats() {
    const cachedLetters = letterCache.get('submissions_data') || [];
    
    if (cachedLetters.length === 0) return;
    
    const stats = calculateLetterStats(cachedLetters);
    
    const totalLettersEl = document.getElementById('totalLetters');
    const pendingReviewEl = document.getElementById('pendingReview');
    const readyToSendEl = document.getElementById('readyToSend');
    const thisMonthEl = document.getElementById('thisMonth');
    
    if (totalLettersEl) {
        animateNumberChange(totalLettersEl, stats.total);
    }
    if (pendingReviewEl) {
        animateNumberChange(pendingReviewEl, stats.pending);
    }
    if (readyToSendEl) {
        animateNumberChange(readyToSendEl, stats.ready);
    }
    if (thisMonthEl) {
        animateNumberChange(thisMonthEl, stats.thisMonth);
    }
}

function calculateLetterStats(letters) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return {
        total: letters.length,
        pending: letters.filter(l => l.reviewStatus === 'في الانتظار').length,
        ready: letters.filter(l => l.reviewStatus === 'جاهز للإرسال').length,
        thisMonth: letters.filter(l => {
            const letterDate = new Date(l.date);
            return letterDate.getMonth() === currentMonth && letterDate.getFullYear() === currentYear;
        }).length
    };
}

function animateNumberChange(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = newValue > currentValue ? 1 : -1;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === newValue) {
            clearInterval(timer);
        }
    }, 50);
}

// OPTIMIZATION: Enhanced rendering with batching
function renderLettersTable(letters) {
    // Use the optimized function from sheets.js
    renderLettersTableOptimized(letters);
}

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

function translateLetterType(type) {
    const typeMap = {
        'New': 'جديد',
        'Reply': 'رد',
        'Follow Up': 'متابعة',
        'Co-op': 'تعاون'
    };
    return typeMap[type] || type;
}

// OPTIMIZATION: Use optimized filters from sheets.js
function setupFilters(letters) {
    setupFiltersOptimized(letters);
}

// OPTIMIZATION: Enhanced Letter Actions with Caching
function reviewLetter(id) {
    // Add loading state
    showActionLoading(id, 'review');
    
    setTimeout(() => {
        window.location.href = `review-letter.html?id=${id}`;
    }, 100);
}

function showActionLoading(id, action) {
    const button = document.querySelector(`button[onclick*="${id}"][onclick*="${action}"]`);
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Restore after 2 seconds if still on page
        setTimeout(() => {
            if (button.parentNode) {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }
        }, 2000);
    }
}

async function downloadLetter(id) {
    try {
        showActionLoading(id, 'download');
        
        // Get from cache first for faster lookup
        const cachedLetters = letterCache.get('submissions_data') || [];
        let letter = cachedLetters.find(l => l.id === id);
        
        // Fallback to fresh data if not in cache
        if (!letter) {
            const letters = await loadSubmissionsDataOptimized();
            letter = letters.find(l => l.id === id);
        }
        
        if (!letter || !letter.letterLink) {
            notify.warning('رابط الخطاب غير متوفر');
            return;
        }
        
        let viewerUrl = letter.letterLink;
        
        // For Google Drive links, use the viewer URL
        if (letter.letterLink.includes('drive.google.com')) {
            const fileId = extractGoogleDriveFileId(letter.letterLink);
            if (fileId) {
                viewerUrl = `https://drive.google.com/file/d/${fileId}/view`;
            }
        }
        
        // Open in new tab
        window.open(viewerUrl, '_blank');
        
    } catch (error) {
        console.error('Error opening letter:', error);
        notify.error('حدث خطأ أثناء فتح الخطاب');
    }
}

function extractGoogleDriveFileId(url) {
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /open\?id=([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

async function deleteLetter(id) {
    if (notify.confirm("هل أنت متأكد من حذف هذا الخطاب؟",
            async () => {
                // Confirmed
                try {
                    await deleteLetterFromSheet(id);
                    notify.success("تم حذف الخطاب بنجاح");
                    setTimeout(() => {
                        window.location.href = "letter-history.html";
                    }, 1000);
                } catch (error) {
                    console.error("Error deleting letter:", error);
                    notify.error("حدث خطأ أثناء حذف الخطاب");
                }
            },
            () => {
                // Cancelled - do nothing
            }
        );
        }

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// OPTIMIZATION: Enhanced Review Form Functions
function loadLettersForReview() {
    const letterSelect = document.getElementById('letterSelect');
    
    // Check if we have a letter ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedId = urlParams.get('id');
    
    // Load from cache first for faster response
    const cachedLetters = letterCache.get('submissions_data');
    
    if (cachedLetters && cachedLetters.length > 0) {
        populateLetterSelect(cachedLetters, preselectedId);
    }
    
    // Load fresh data in background
    loadSubmissionsDataOptimized().then(letters => {
        if (letters.length > 0) {
            populateLetterSelect(letters, preselectedId);
        }
    });
}

function populateLetterSelect(letters, preselectedId) {
    const letterSelect = document.getElementById('letterSelect');
    if (!letterSelect) return;
    
    // Clear existing options first
    letterSelect.innerHTML = '<option value="">اختر خطاباً</option>';
    
    letters.forEach(letter => {
        const option = document.createElement('option');
        option.value = letter.id;
        option.textContent = `${letter.id} - ${letter.recipient} - ${letter.subject}`;
        letterSelect.appendChild(option);
    });
    
    // If there's a preselected ID from URL, select it and load the letter
    if (preselectedId) {
        letterSelect.value = preselectedId;
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.style.display = 'block';
            loadLetterForReview(preselectedId);
        }
    }
}

function setupReviewForm() {
    const letterSelect = document.getElementById('letterSelect');
    const reviewForm = document.getElementById('reviewForm');
    const reviewCheckbox = document.getElementById('reviewComplete');
    const actionButtons = document.querySelectorAll('.action-button');
    
    if (letterSelect) {
        letterSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                if (reviewForm) reviewForm.style.display = 'block';
                loadLetterForReview(e.target.value);
            } else {
                if (reviewForm) reviewForm.style.display = 'none';
            }
        });
    }
    
    if (reviewCheckbox) {
        reviewCheckbox.addEventListener('change', (e) => {
            actionButtons.forEach(button => {
                button.disabled = !e.target.checked;
            });
        });
    }
    
    // Setup action buttons
    const readyButton = document.getElementById('readyButton');
    const improvementButton = document.getElementById('improvementButton');
    const rejectedButton = document.getElementById('rejectedButton');
    
    if (readyButton) {
        readyButton.addEventListener('click', () => updateReviewStatus('جاهز للإرسال'));
    }
    if (improvementButton) {
        improvementButton.addEventListener('click', () => updateReviewStatus('يحتاج إلى تحسينات'));
    }
    if (rejectedButton) {
        rejectedButton.addEventListener('click', () => updateReviewStatus('مرفوض'));
    }
}

function loadLetterForReview(id) {
    // Try cache first
    const cachedLetters = letterCache.get('submissions_data');
    let letter = cachedLetters ? cachedLetters.find(l => l.id === id) : null;
    
    if (letter) {
        displayLetterForReview(letter);
    } else {
        // Load from server if not in cache
        loadSubmissionsDataOptimized().then(letters => {
            letter = letters.find(l => l.id === id);
            if (letter) {
                displayLetterForReview(letter);
            } else {
                displayLetterError();
            }
        }).catch(error => {
            console.error('Error loading letter:', error);
            displayLetterError();
        });
    }
}

function displayLetterForReview(letter) {
    const letterContent = document.getElementById('letterContentReview');
    const reviewerNameInput = document.getElementById('reviewerName');
    const reviewNotesInput = document.getElementById('reviewNotes');
    
    if (letterContent) {
        letterContent.value = letter.content || 'محتوى الخطاب غير متوفر';
    }
    
    if (reviewerNameInput) {
        reviewerNameInput.value = letter.reviewerName || '';
    }
    
    if (reviewNotesInput) {
        reviewNotesInput.value = letter.reviewNotes || '';
    }
}

function displayLetterError() {
    const letterContent = document.getElementById('letterContentReview');
    if (letterContent) {
        letterContent.value = 'حدث خطأ في تحميل محتوى الخطاب';
    }
}

async function updateReviewStatus(status) {
    const reviewerName = document.getElementById('reviewerName')?.value;
    const notes = document.getElementById('reviewNotes')?.value;
    const letterId = document.getElementById('letterSelect')?.value;
    const letterContent = document.getElementById('letterContentReview')?.value;
    
    if (!reviewerName) {
        notify.warning('الرجاء إدخال اسم المراجع');
        return;
    }
    
    if (!letterId) {
        notify.warning('الرجاء اختيار خطاب للمراجعة');
        return;
    }
    
    try {
        // Show loading state
        const activeButton = document.querySelector('.action-button:focus') || 
                   document.querySelector(`.action-button.${status.includes('جاهز') ? 'ready' : status.includes('تحسينات') ? 'needs-improvement' : 'rejected'}`);
        
        if (activeButton) {
            const originalText = activeButton.innerHTML;
            activeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
            activeButton.disabled = true;
        }
        
        // Update the status in Google Sheets
        await updateReviewStatusInSheet(letterId, status, reviewerName, notes, letterContent);
        
        // Show success message
        showSuccessMessage(`تم تحديث حالة المراجعة إلى: ${status}`);
        
        // Redirect to letter history with highlight
        setTimeout(() => {
            window.location.href = `letter-history.html?highlight=${letterId}`;
        }, 1500);
        
    } catch (error) {
        console.error('Error updating review status:', error);
        notify.error('حدث خطأ أثناء تحديث حالة المراجعة');
        
        // Restore button state
        if (activeButton) {
            activeButton.innerHTML = originalText;
            activeButton.disabled = false;
        }
    }
}

// OPTIMIZATION: CSV Export Function
async function exportLettersToCSV() {
    try {
        const exportButton = document.querySelector('.quick-action-btn.export');
        if (exportButton) {
            const originalHTML = exportButton.innerHTML;
            exportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التصدير...';
            exportButton.disabled = true;
        }
        
        // Get fresh data
        const letters = await loadSubmissionsDataOptimized();
        
        if (letters.length === 0) {
            alert('لا توجد خطابات للتصدير');
            return;
        }
        
        // Create CSV content
        const headers = [
            'الرقم المرجعي',
            'التاريخ',
            'نوع الخطاب',
            'المستلم',
            'الموضوع',
            'حالة المراجعة',
            'حالة الإرسال',
            'اسم المراجع',
            'الملاحظات',
            'الكاتب'
        ];
        
        const csvContent = [
            headers.join(','),
            ...letters.map(letter => [
                letter.id,
                letter.date,
                translateLetterType(letter.type),
                letter.recipient,
                letter.subject,
                letter.reviewStatus,
                letter.sendStatus,
                letter.reviewerName || '',
                letter.reviewNotes || '',
                letter.writer || ''
            ].map(field => `"${field}"`).join(','))
        ].join('\n');
        
        // Download CSV
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `letter-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showSuccessMessage('تم تصدير البيانات بنجاح');
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('حدث خطأ أثناء تصدير البيانات');
    } finally {
        // Restore button state
        const exportButton = document.querySelector('.quick-action-btn.export');
        if (exportButton) {
            exportButton.innerHTML = '<i class="fas fa-download"></i> تصدير';
            exportButton.disabled = false;
        }
    }
}

// OPTIMIZATION: Performance Monitoring
function initializePerformanceMonitoring() {
    if (window.perfMonitor) {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`📊 Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Slow page load detected');
                showPerformanceHint();
            }
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
                const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024);
                
                if (usedMB > 100) { // More than 100MB
                    console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }
}

function showPerformanceHint() {
    const hint = document.createElement('div');
    hint.className = 'performance-hint';
    hint.innerHTML = `
        <div class="hint-content">
            <i class="fas fa-lightbulb"></i>
            <p>لتحسين الأداء، يمكنك مسح ذاكرة التخزين المؤقت</p>
            <button onclick="clearAppCache()" class="hint-btn">مسح الذاكرة</button>
            <button onclick="this.parentElement.parentElement.remove()" class="hint-close">×</button>
        </div>
    `;
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
        if (hint.parentNode) {
            hint.parentNode.removeChild(hint);
        }
    }, 10000);
}

function clearAppCache() {
    letterCache.clear();
    localStorage.removeItem('theme');
    localStorage.clear();
    
    showSuccessMessage('تم مسح ذاكرة التخزين المؤقت');
    
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// OPTIMIZATION: Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing optimized main.js...');
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Set up intersection observer for lazy loading
    setupIntersectionObserver();
    
    // Initialize page-specific optimizations
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'letter-history.html':
            console.log('📋 Initializing letter history page...');
            loadLetterHistory();
            break;
            
        case 'review-letter.html':
            console.log('🔍 Initializing review letter page...');
            loadLettersForReview();
            setupReviewForm();
            break;
            
        case 'create-letter.html':
            console.log('✏️ Initializing create letter page...');
            // Initialize create letter optimizations
            break;
            
        default:
            console.log('🏠 Initializing default page...');
            break;
    }
});

function setupIntersectionObserver() {
    // Set up intersection observer for performance optimization
    const observerOptions = {
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is visible, can trigger actions if needed
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements that need lazy loading
    const lazyElements = document.querySelectorAll('.lazy-load');
    lazyElements.forEach(element => {
        observer.observe(element);
    });
}

// OPTIMIZATION: Cleanup on page unload
window.addEventListener('beforeunload', () => {
    console.log('🧹 Cleaning up optimizations...');
    
    // Stop background sync
    if (window.backgroundSync) {
        window.backgroundSync.stop();
    }
    
    // Log performance summary
    if (window.perfMonitor) {
        window.perfMonitor.logSummary();
    }
    
    // Save any pending cache updates
    if (window.letterCache) {
        window.letterCache.saveToStorage();
    }
});

// Export functions for global access
window.loadLetterHistory = loadLetterHistory;
window.reviewLetter = reviewLetter;
window.downloadLetter = downloadLetter;
window.deleteLetter = deleteLetter;
window.exportLettersToCSV = exportLettersToCSV;
window.clearAppCache = clearAppCache;


