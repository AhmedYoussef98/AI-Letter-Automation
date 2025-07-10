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
    const editLabel = document.getElementById('editLabel');
    if (templateType === 'template1') {
        if (documentTemplate) documentTemplate.style.display = 'block';
        if (letterPreview) letterPreview.style.display = 'none';
        if (editLabel) editLabel.style.display = 'none';
    } else {
        if (documentTemplate) documentTemplate.style.display = 'none';
        if (letterPreview) letterPreview.style.display = 'block';
        if (editLabel) editLabel.style.display = 'block';
    }
}

// Sync edits from textarea to preview when switching back to preview mode
document.addEventListener('DOMContentLoaded', function() {
    const templateRadios = document.querySelectorAll('input[name="template"]');
    templateRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // If switching from edit to preview, update preview content
            if (this.value === 'template1') {
                const letterPreview = document.getElementById('letterPreview');
                const mainLetterContent = document.getElementById('mainLetterContent');
                if (letterPreview && mainLetterContent) {
                    mainLetterContent.innerHTML = formatLetterContent(letterPreview.value);
                }
            }
            toggleTemplateView(this.value);
        });
    });
    toggleTemplateView('template1');
});
