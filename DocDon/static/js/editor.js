document.addEventListener('DOMContentLoaded', function () {
    const pageHeight = 1056; // Standard letter-sized page height
    const pageContainer = document.getElementById('pages-container');
    let quillInstances = [];

    function initializeEditor(element) {
        let quill = new Quill(element, {
            theme: 'snow',
            placeholder: 'Start writing...',
            modules: {
                toolbar: '#toolbar'
            }
        });
        quillInstances.push(quill);
    }

    function ensureFirstPage() {
        if (document.querySelectorAll('.page').length === 0) {
            addNewPage();
        }
    }

    function addNewPage() {
        let newPage = document.createElement('div');
        newPage.classList.add('page');

        let newEditor = document.createElement('div');
        newEditor.classList.add('editor');
        newPage.appendChild(newEditor);
        pageContainer.appendChild(newPage);

        initializeEditor(newEditor);
    }

    function checkPageOverflow() {
        let pages = document.querySelectorAll('.page');
        let lastPage = pages[pages.length - 1];
        let editor = lastPage.querySelector('.ql-editor');

        if (editor.scrollHeight > pageHeight - 50) {
            addNewPage();
        }
    }

    function autoSave() {
        let contentArray = quillInstances.map(q => q.root.innerHTML);
        let content = contentArray.join('<div class="page-break"></div>');

        fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content })
        });
    }

    ensureFirstPage();
    document.addEventListener('input', checkPageOverflow);
    setInterval(autoSave, 5000);
});
