// Document Template Functions - LETTER CONTENT ONLY

function populateDocumentTemplate(letterData) {
    // Set only the main letter content
    const letterContent = letterData.Letter || letterData.content || '';
    const mainLetterContentEl = document.getElementById('mainLetterContent');
    if (mainLetterContentEl) {
        mainLetterContentEl.innerHTML = formatLetterContent(letterContent);
    }

    // For backward compatibility, update the hidden textarea if it exists
    const letterPreviewEl = document.getElementById('letterPreview');
    if (letterPreviewEl) {
        letterPreviewEl.value = letterContent;
    }
}

// Formats the content as paragraphs (optional: you can remove this if you want plain text)
function formatLetterContent(content) {
    // Split content into paragraphs and format them
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
}

// Minimal toggleTemplateView, in case you still use template switching
function toggleTemplateView(templateType) {
    const documentTemplate = document.getElementById('documentTemplate');
    const letterPreview = document.getElementById('letterPreview');
    if (templateType === 'template1') {
        if (documentTemplate) documentTemplate.style.display = 'block';
        if (letterPreview) letterPreview.style.display = 'none';
    } else {
        if (documentTemplate) documentTemplate.style.display = 'none';
        if (letterPreview) letterPreview.style.display = 'block';
    }
}

// Optional: still allow template selection if the UI uses it
document.addEventListener('DOMContentLoaded', function() {
    const templateRadios = document.querySelectorAll('input[name="template"]');
    templateRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleTemplateView(this.value);
        });
    });
    toggleTemplateView('template1');
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        populateDocumentTemplate,
        formatLetterContent,
        toggleTemplateView
    };
}
