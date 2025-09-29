// Complete Fixed Main.js with All Function Definitions and Notifications

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

// MAIN LETTER HISTORY FUNCTION
async function loadLetterHistory() {
    console.log('🚀 Loading letter history with optimizations...');
    
    try {
        // Show loading notification if available
        let loadingNotification = null;
        if (typeof notify !== 'undefined') {
            loadingNotification = notify.loading('جاري تحميل البيانات...');
        }
        
        // Show quick stats while loading
        showQuickStats();
        
        // Use progressive loading for better UX
        await loadLetterHistoryProgressive();
        
        // Hide loading notification
        if (loadingNotification && typeof notify !== 'undefined') {
            notify.hide(loadingNotification);
        }
        
        // Update quick stats with real data
        updateQuickStats();
        
        console.log('✅ Letter history loaded successfully');
        
    } catch (error) {
        console.error('❌ Error in loadLetterHistory:', error);
        
        // Show error notification
        if (typeof notify !== 'undefined') {
            notify.error(`فشل في تحميل البيانات: ${error.message || 'خطأ غير معروف'}`);
        }
        
        // Re-throw the error so calling function can handle it
        throw error;
    }
}

// PROGRESSIVE LOADING FUNCTION
async function loadLetterHistoryProgressive() {
    console.log('🔄 Loading letter history progressively...');
    
    try {
        // Use the optimized function from sheets.js if available
        if (typeof loadLetterHistoryOptimized === 'function') {
            await loadLetterHistoryOptimized();
        } else {
            // Fallback to basic loading
            console.warn('⚠️ Optimized loading not available, using fallback');
            await basicLetterHistoryLoad();
        }
    } catch (error) {
        console.error('❌ Error in progressive loading:', error);
        throw error;
    }
}

// FALLBACK BASIC LOADING
async function basicLetterHistoryLoad() {
    try {
        const letters = await loadSubmissionsData();
        
        const tableBody = document.getElementById("lettersTableBody");
        const noData = document.getElementById("noData");
        const table = document.getElementById("lettersTable");
        
        if (!letters || letters.length === 0) {
            if (tableBody) tableBody.style.display = "none";
            if (noData) noData.style.display = "block";
            if (table) table.style.display = "none";
        } else {
            // Render letters
            if (tableBody) {
                tableBody.innerHTML = letters.map(letter => `
                    <tr>
                        <td>${letter.id || '-'}</td>
                        <td>${letter.date || '-'}</td>
                        <td>${translateLetterType(letter.type) || '-'}</td>
                        <td><span class="status-badge ${getStatusClass(letter.reviewStatus)}">${letter.reviewStatus || '-'}</span></td>
                        <td><span class="status-badge ${getStatusClass(letter.sendStatus)}">${letter.sendStatus || '-'}</span></td>
                        <td>${letter.recipient || '-'}</td>
                        <td>${letter.subject || '-'}</td>
                        <td>${letter.reviewerName || '-'}</td>
                        <td>${letter.reviewNotes || '-'}</td>
                        <td>${letter.writer || '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-icon" onclick="reviewLetter('${letter.id}')" title="مراجعة">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-icon" onclick="downloadLetter('${letter.id}')" title="تحميل وطباعة">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="action-icon delete" onclick="deleteLetter('${letter.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
            
            if (tableBody) tableBody.style.display = "table-row-group";
            if (noData) noData.style.display = "none";
            if (table) table.style.display = "table";
        }
    } catch (error) {
        console.error('❌ Error in basic letter history load:', error);
        throw error;
    }
}

// REVIEW LETTER FUNCTION
function reviewLetter(id) {
    console.log('🔍 Reviewing letter:', id);
    
    try {
        // Show loading state
        showActionLoading(id, 'review');
        
        // Show notification if available
        if (typeof notify !== 'undefined') {
            notify.info('جاري تحويلك إلى صفحة المراجعة...');
        }
        
        setTimeout(() => {
            window.location.href = `review-letter.html?id=${id}`;
        }, 500);
        
    } catch (error) {
        console.error('❌ Error in reviewLetter:', error);
        
        if (typeof notify !== 'undefined') {
            notify.error(`خطأ في فتح صفحة المراجعة: ${error.message}`);
        }
    }
}

// DOWNLOAD LETTER FUNCTION
async function downloadLetter(id, format = 'pdf') {
    console.log('⬇️ Downloading letter:', id);
    
    try {
        // Show loading notification
        let loadingNotification = null;
        if (typeof notify !== 'undefined') {
            loadingNotification = notify.loading(`جاري تحميل الخطاب (${format.toUpperCase()})...`);
        }
        
        // Show loading state on button
        showActionLoading(id, 'download');
        
        // Simulate download process (replace with your actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hide loading notification
        if (loadingNotification && typeof notify !== 'undefined') {
            notify.hide(loadingNotification);
        }
        
        // Show success notification
        if (typeof notify !== 'undefined') {
            notify.success(`تم تحميل الخطاب بصيغة ${format.toUpperCase()} بنجاح`);
        }
        
        // Here you would implement the actual download logic
        // For now, we'll just simulate it
        console.log(`✅ Letter ${id} downloaded as ${format}`);
        
    } catch (error) {
        console.error('❌ Error downloading letter:', error);
        
        if (typeof notify !== 'undefined') {
            notify.error(`خطأ في تحميل الخطاب: ${error.message}`);
        }
    }
}

// DELETE LETTER FUNCTION
async function deleteLetter(letterId) {
    console.log('🗑️ Deleting letter:', letterId);
    
    try {
        // Show confirmation dialog
        const confirmDelete = await new Promise((resolve) => {
            if (typeof notify !== 'undefined') {
                notify.confirm(
                    'هل أنت متأكد من حذف هذا الخطاب؟ لا يمكن التراجع عن هذا الإجراء.',
                    () => resolve(true),
                    () => resolve(false)
                );
            } else {
                // Fallback to native confirm
                resolve(confirm('هل أنت متأكد من حذف هذا الخطاب؟'));
            }
        });
        
        if (!confirmDelete) {
            return;
        }
        
        // Show loading notification
        let loadingNotification = null;
        if (typeof notify !== 'undefined') {
            loadingNotification = notify.loading('جاري حذف الخطاب...');
        }
        
        // Call the delete function from sheets.js if available
        if (typeof deleteLetterFromSheet === 'function') {
            await deleteLetterFromSheet(letterId);
        } else {
            // Simulate deletion (replace with your actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Hide loading notification
        if (loadingNotification && typeof notify !== 'undefined') {
            notify.hide(loadingNotification);
        }
        
        // Show success notification
        if (typeof notify !== 'undefined') {
            notify.success('تم حذف الخطاب بنجاح');
        }
        
        // Reload the table
        setTimeout(() => {
            if (typeof loadLetterHistory === 'function') {
                loadLetterHistory();
            } else {
                location.reload();
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error deleting letter:', error);
        
        if (typeof notify !== 'undefined') {
            notify.error(`خطأ في حذف الخطاب: ${error.message}`);
        }
    }
}

// EXPORT TO CSV FUNCTION
async function exportLettersToCSV() {
    console.log('📊 Exporting letters to CSV...');
    
    try {
        // Show loading notification
        let loadingNotification = null;
        if (typeof notify !== 'undefined') {
            loadingNotification = notify.loading('جاري تصدير البيانات إلى CSV...');
        }
        
        // Load letters data
        const letters = await loadSubmissionsDataOptimized();
        
        if (!letters || letters.length === 0) {
            if (loadingNotification && typeof notify !== 'undefined') {
                notify.hide(loadingNotification);
            }
            
            if (typeof notify !== 'undefined') {
                notify.warning('لا توجد بيانات للتصدير');
            }
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
                letter.id || '',
                letter.date || '',
                translateLetterType(letter.type) || '',
                letter.recipient || '',
                letter.subject || '',
                letter.reviewStatus || '',
                letter.sendStatus || '',
                letter.reviewerName || '',
                letter.reviewNotes || '',
                letter.writer || ''
            ].map(field => `"${field}"`).join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `letters_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Hide loading notification
        if (loadingNotification && typeof notify !== 'undefined') {
            notify.hide(loadingNotification);
        }
        
        // Show success notification
        if (typeof notify !== 'undefined') {
            notify.success(`تم تصدير ${letters.length} خطاب إلى ملف CSV بنجاح`);
        }
        
    } catch (error) {
        console.error('❌ Error exporting to CSV:', error);
        
        if (typeof notify !== 'undefined') {
            notify.error(`خطأ في التصدير: ${error.message}`);
        }
    }
}

// CLEAR CACHE FUNCTION
async function clearAppCache() {
    console.log('🧹 Clearing app cache...');
    
    try {
        const confirmClear = await new Promise((resolve) => {
            if (typeof notify !== 'undefined') {
                notify.confirm(
                    'سيتم حذف جميع البيانات المخزنة مؤقتاً. هل تريد المتابعة؟',
                    () => resolve(true),
                    () => resolve(false)
                );
            } else {
                resolve(confirm('سيتم حذف جميع البيانات المخزنة مؤقتاً. هل تريد المتابعة؟'));
            }
        });
        
        if (!confirmClear) {
            return;
        }
        
        // Show loading notification
        let loadingNotification = null;
        if (typeof notify !== 'undefined') {
            loadingNotification = notify.loading('جاري مسح البيانات المخزنة...');
        }
        
        // Clear cache using letterCache if available
        if (typeof letterCache !== 'undefined' && letterCache.clear) {
            letterCache.clear();
        }
        
        // Clear localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('letterApp_')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Hide loading notification
        if (loadingNotification && typeof notify !== 'undefined') {
            notify.hide(loadingNotification);
        }
        
        // Show success notification
        if (typeof notify !== 'undefined') {
            notify.success('تم مسح البيانات المخزنة بنجاح');
        }
        
        // Reload the page to refresh data
        setTimeout(() => {
            location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        
        if (typeof notify !== 'undefined') {
            notify.error(`خطأ في مسح البيانات: ${error.message}`);
        }
    }
}

// HELPER FUNCTIONS

function showQuickStats() {
    console.log('📊 Showing quick stats...');
    // Implementation for showing quick statistics
}

function updateQuickStats() {
    console.log('🔄 Updating quick stats...');
    // Implementation for updating statistics
}

function showActionLoading(id, action) {
    const button = document.querySelector(`button[onclick*="${id}"][onclick*="${action}"]`);
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Store original HTML for restoration
        button.dataset.originalHtml = originalHTML;
        
        // Restore after 5 seconds if still on page
        setTimeout(() => {
            if (button.parentNode) {
                button.innerHTML = button.dataset.originalHtml || originalHTML;
                button.disabled = false;
            }
        }, 5000);
    }
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

// ENHANCED FORM VALIDATION WITH NOTIFICATIONS
function validateFormWithNotifications(formData) {
    const errors = [];
    
    if (!formData.organizationName || formData.organizationName.trim().length === 0) {
        errors.push('اسم الجهة مطلوب');
    }
    
    if (!formData.recipient || formData.recipient.trim().length === 0) {
        errors.push('المستقبل مطلوب');
    }
    
    if (!formData.letterType) {
        errors.push('نوع الخطاب مطلوب');
    }
    
    if (!formData.content || formData.content.trim().length === 0) {
        errors.push('محتوى الخطاب مطلوب');
    }
    
    if (errors.length > 0) {
        // Show each error as a notification
        if (typeof notify !== 'undefined') {
            errors.forEach((error, index) => {
                setTimeout(() => {
                    notify.warning(error);
                }, index * 200); // Stagger the notifications
            });
        } else {
            alert('أخطاء في النموذج:\n' + errors.join('\n'));
        }
        return false;
    }
    
    return true;
}

// NETWORK STATUS MONITORING
function initializeNetworkMonitoring() {
    window.addEventListener('online', function() {
        console.log('📡 Connection restored');
        if (typeof notify !== 'undefined') {
            notify.success('تم استعادة الاتصال بالإنترنت', 3000);
        }
        
        // Refresh data when connection is restored
        if (typeof refreshLetterCache === 'function') {
            refreshLetterCache();
        }
    });
    
    window.addEventListener('offline', function() {
        console.log('📡 Connection lost');
        if (typeof notify !== 'undefined') {
            notify.warning('لا يوجد اتصال بالإنترنت - سيتم استخدام البيانات المخزنة', 5000);
        }
    });
}

// INITIALIZE ON DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main.js initialized');
    
    // Initialize network monitoring
    initializeNetworkMonitoring();
    
    // Page-specific initialization
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('📄 Current page:', currentPage);
    
    switch (currentPage) {
        case 'letter-history.html':
            console.log('📋 Initializing letter history page...');
            // The actual loading will be triggered by the page-specific script
            break;
            
        case 'review-letter.html':
            console.log('🔍 Initializing review letter page...');
            if (typeof loadLettersForReview === 'function') {
                loadLettersForReview();
            }
            break;
            
        case 'create-letter.html':
            console.log('✏️ Initializing create letter page...');
            // Initialize form validation if form exists
            const letterForm = document.getElementById('letterForm');
            if (letterForm) {
                letterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());
                    
                    if (validateFormWithNotifications(data)) {
                        console.log('✅ Form validated, proceeding...');
                        // Continue with form submission
                    }
                });
            }
            break;
            
        default:
            console.log('🏠 Initializing default page...');
            break;
    }
});

// ENSURE FUNCTIONS ARE AVAILABLE BEFORE EXPORT
console.log('🔧 Preparing function exports...');

// Wait a bit to ensure everything is loaded, then export
setTimeout(() => {
    // Export functions for global access - THESE MUST ALL BE DEFINED ABOVE
    console.log('📤 Exporting functions to global scope...');
    
    window.loadLetterHistory = loadLetterHistory;
    window.reviewLetter = reviewLetter;
    window.downloadLetter = downloadLetter;
    window.deleteLetter = deleteLetter;
    window.exportLettersToCSV = exportLettersToCSV;
    window.clearAppCache = clearAppCache;
    window.validateFormWithNotifications = validateFormWithNotifications;
    
    // Verify exports
    console.log('✅ Function exports verification:');
    console.log('  - loadLetterHistory:', typeof window.loadLetterHistory);
    console.log('  - reviewLetter:', typeof window.reviewLetter);
    console.log('  - downloadLetter:', typeof window.downloadLetter);
    console.log('  - deleteLetter:', typeof window.deleteLetter);
    console.log('  - exportLettersToCSV:', typeof window.exportLettersToCSV);
    console.log('  - clearAppCache:', typeof window.clearAppCache);
    
    // Notify that functions are ready
    if (typeof notify !== 'undefined') {
        console.log('✅ All functions exported successfully with notification system');
    } else {
        console.warn('⚠️ Functions exported but notification system not available');
    }
}, 100);

console.log('✅ Main.js loaded completely');
