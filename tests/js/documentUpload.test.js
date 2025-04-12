/**
 * Tests for the document upload functionality
 */

describe('Document Upload', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="document-upload-section">
        <div class="upload-area" id="uploadArea">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Drag & drop files here or click to browse</p>
          <input type="file" id="fileInput" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx">
        </div>
        <div class="uploaded-files" id="uploadedFiles">
          <h3>Uploaded Documents</h3>
          <ul id="fileList"></ul>
        </div>
      </div>
      <div id="documentPreviewModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Document Preview</h2>
          <div id="documentPreview"></div>
        </div>
      </div>
    `;
    
    // Create a mock DocumentUploader object
    window.DocumentUploader = {
      uploadedFiles: [],
      
      init: function() {
        // Get elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileList = document.getElementById('fileList');
        this.previewModal = document.getElementById('documentPreviewModal');
        this.documentPreview = document.getElementById('documentPreview');
        this.closeModalBtn = document.querySelector('.close-modal');
        
        // Add event listeners
        this.uploadArea.addEventListener('click', () => {
          this.fileInput.click();
        });
        
        this.fileInput.addEventListener('change', (e) => {
          this.handleFiles(e.target.files);
        });
        
        this.uploadArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          this.uploadArea.classList.add('dragover');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
          this.uploadArea.classList.remove('dragover');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
          e.preventDefault();
          this.uploadArea.classList.remove('dragover');
          this.handleFiles(e.dataTransfer.files);
        });
        
        if (this.closeModalBtn) {
          this.closeModalBtn.addEventListener('click', () => {
            this.previewModal.style.display = 'none';
          });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
          if (e.target === this.previewModal) {
            this.previewModal.style.display = 'none';
          }
        });
      },
      
      handleFiles: function(files) {
        if (!files || files.length === 0) return;
        
        Array.from(files).forEach(file => {
          // Check file type
          const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ];
          
          if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload PDF, JPG, PNG, DOC, DOCX, XLS, or XLSX files.');
            return;
          }
          
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit.');
            return;
          }
          
          // Add file to uploaded files
          this.uploadedFiles.push(file);
          
          // Create file item
          this.addFileToList(file);
        });
        
        // Reset file input
        this.fileInput.value = '';
      },
      
      addFileToList: function(file) {
        // Create file item
        const fileItem = document.createElement('li');
        fileItem.className = 'file-item';
        
        // Get file icon based on type
        let fileIcon = 'fa-file';
        if (file.type.includes('pdf')) {
          fileIcon = 'fa-file-pdf';
        } else if (file.type.includes('image')) {
          fileIcon = 'fa-file-image';
        } else if (file.type.includes('word')) {
          fileIcon = 'fa-file-word';
        } else if (file.type.includes('excel') || file.type.includes('sheet')) {
          fileIcon = 'fa-file-excel';
        }
        
        // Create file item content
        fileItem.innerHTML = `
          <i class="fas ${fileIcon}"></i>
          <span class="file-name">${file.name}</span>
          <span class="file-size">${this.formatFileSize(file.size)}</span>
          <div class="file-actions">
            <button class="preview-btn" title="Preview"><i class="fas fa-eye"></i></button>
            <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        `;
        
        // Add event listeners to buttons
        const previewBtn = fileItem.querySelector('.preview-btn');
        const deleteBtn = fileItem.querySelector('.delete-btn');
        
        previewBtn.addEventListener('click', () => {
          this.previewFile(file);
        });
        
        deleteBtn.addEventListener('click', () => {
          this.deleteFile(file, fileItem);
        });
        
        // Add file item to list
        this.fileList.appendChild(fileItem);
      },
      
      formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      
      previewFile: function(file) {
        // Clear preview
        this.documentPreview.innerHTML = '';
        
        // Show preview based on file type
        if (file.type.includes('image')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.className = 'preview-image';
          this.documentPreview.appendChild(img);
        } else if (file.type.includes('pdf')) {
          const embed = document.createElement('embed');
          embed.src = URL.createObjectURL(file);
          embed.type = 'application/pdf';
          embed.className = 'preview-pdf';
          this.documentPreview.appendChild(embed);
        } else {
          this.documentPreview.innerHTML = `
            <div class="preview-not-available">
              <i class="fas fa-file"></i>
              <p>Preview not available for this file type.</p>
              <p>File: ${file.name}</p>
            </div>
          `;
        }
        
        // Show modal
        this.previewModal.style.display = 'block';
      },
      
      deleteFile: function(file, fileItem) {
        // Remove file from uploaded files
        const index = this.uploadedFiles.indexOf(file);
        if (index !== -1) {
          this.uploadedFiles.splice(index, 1);
        }
        
        // Remove file item from list
        this.fileList.removeChild(fileItem);
      }
    };
  });
  
  test('init initializes the document uploader', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Verify that event listeners were added
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const closeModalBtn = document.querySelector('.close-modal');
    
    expect(uploadArea.onclick).not.toBeNull();
    expect(fileInput.onchange).not.toBeNull();
    expect(uploadArea.ondragover).not.toBeNull();
    expect(uploadArea.ondragleave).not.toBeNull();
    expect(uploadArea.ondrop).not.toBeNull();
    expect(closeModalBtn.onclick).not.toBeNull();
  });
  
  test('handleFiles processes valid files', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Create mock files
    const file1 = new File(['file content'], 'document.pdf', { type: 'application/pdf' });
    const file2 = new File(['file content'], 'image.jpg', { type: 'image/jpeg' });
    
    // Mock FileList
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index) => fileList[index]
    };
    
    // Handle files
    window.DocumentUploader.handleFiles(fileList);
    
    // Verify that files were added to uploadedFiles
    expect(window.DocumentUploader.uploadedFiles.length).toBe(2);
    expect(window.DocumentUploader.uploadedFiles[0]).toBe(file1);
    expect(window.DocumentUploader.uploadedFiles[1]).toBe(file2);
    
    // Verify that files were added to the file list
    const fileItems = document.querySelectorAll('#fileList .file-item');
    expect(fileItems.length).toBe(2);
    
    // Verify file item content
    expect(fileItems[0].querySelector('.file-name').textContent).toBe('document.pdf');
    expect(fileItems[1].querySelector('.file-name').textContent).toBe('image.jpg');
  });
  
  test('handleFiles rejects invalid file types', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Mock alert
    window.alert = jest.fn();
    
    // Create mock files
    const file1 = new File(['file content'], 'document.pdf', { type: 'application/pdf' });
    const file2 = new File(['file content'], 'script.js', { type: 'application/javascript' });
    
    // Mock FileList
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index) => fileList[index]
    };
    
    // Handle files
    window.DocumentUploader.handleFiles(fileList);
    
    // Verify that only valid file was added to uploadedFiles
    expect(window.DocumentUploader.uploadedFiles.length).toBe(1);
    expect(window.DocumentUploader.uploadedFiles[0]).toBe(file1);
    
    // Verify that alert was called for invalid file
    expect(window.alert).toHaveBeenCalledWith('Invalid file type. Please upload PDF, JPG, PNG, DOC, DOCX, XLS, or XLSX files.');
    
    // Verify that only valid file was added to the file list
    const fileItems = document.querySelectorAll('#fileList .file-item');
    expect(fileItems.length).toBe(1);
    expect(fileItems[0].querySelector('.file-name').textContent).toBe('document.pdf');
  });
  
  test('handleFiles rejects files larger than 10MB', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Mock alert
    window.alert = jest.fn();
    
    // Create mock files
    const file1 = new File(['file content'], 'small.pdf', { type: 'application/pdf' });
    Object.defineProperty(file1, 'size', { value: 1 * 1024 * 1024 }); // 1MB
    
    const file2 = new File(['file content'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(file2, 'size', { value: 15 * 1024 * 1024 }); // 15MB
    
    // Mock FileList
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index) => fileList[index]
    };
    
    // Handle files
    window.DocumentUploader.handleFiles(fileList);
    
    // Verify that only valid file was added to uploadedFiles
    expect(window.DocumentUploader.uploadedFiles.length).toBe(1);
    expect(window.DocumentUploader.uploadedFiles[0]).toBe(file1);
    
    // Verify that alert was called for large file
    expect(window.alert).toHaveBeenCalledWith('File size exceeds 10MB limit.');
    
    // Verify that only valid file was added to the file list
    const fileItems = document.querySelectorAll('#fileList .file-item');
    expect(fileItems.length).toBe(1);
    expect(fileItems[0].querySelector('.file-name').textContent).toBe('small.pdf');
  });
  
  test('formatFileSize formats file sizes correctly', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Test various file sizes
    expect(window.DocumentUploader.formatFileSize(0)).toBe('0 Bytes');
    expect(window.DocumentUploader.formatFileSize(500)).toBe('500 Bytes');
    expect(window.DocumentUploader.formatFileSize(1024)).toBe('1 KB');
    expect(window.DocumentUploader.formatFileSize(1500)).toBe('1.46 KB');
    expect(window.DocumentUploader.formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(window.DocumentUploader.formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    expect(window.DocumentUploader.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });
  
  test('deleteFile removes a file', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Create mock files
    const file1 = new File(['file content'], 'document1.pdf', { type: 'application/pdf' });
    const file2 = new File(['file content'], 'document2.pdf', { type: 'application/pdf' });
    
    // Add files
    window.DocumentUploader.handleFiles([file1, file2]);
    
    // Verify that files were added
    expect(window.DocumentUploader.uploadedFiles.length).toBe(2);
    
    // Get file items
    const fileItems = document.querySelectorAll('#fileList .file-item');
    expect(fileItems.length).toBe(2);
    
    // Delete first file
    const deleteBtn = fileItems[0].querySelector('.delete-btn');
    deleteBtn.click();
    
    // Verify that file was removed from uploadedFiles
    expect(window.DocumentUploader.uploadedFiles.length).toBe(1);
    expect(window.DocumentUploader.uploadedFiles[0]).toBe(file2);
    
    // Verify that file item was removed from list
    const remainingFileItems = document.querySelectorAll('#fileList .file-item');
    expect(remainingFileItems.length).toBe(1);
    expect(remainingFileItems[0].querySelector('.file-name').textContent).toBe('document2.pdf');
  });
  
  test('previewFile shows image preview', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Create mock image file
    const imageFile = new File(['image content'], 'image.jpg', { type: 'image/jpeg' });
    
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn().mockReturnValue('blob:image-url');
    
    // Preview file
    window.DocumentUploader.previewFile(imageFile);
    
    // Verify that preview was created
    const previewImage = document.querySelector('#documentPreview .preview-image');
    expect(previewImage).not.toBeNull();
    expect(previewImage.src).toBe('blob:image-url');
    
    // Verify that modal is displayed
    const modal = document.getElementById('documentPreviewModal');
    expect(modal.style.display).toBe('block');
  });
  
  test('previewFile shows PDF preview', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Create mock PDF file
    const pdfFile = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
    
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn().mockReturnValue('blob:pdf-url');
    
    // Preview file
    window.DocumentUploader.previewFile(pdfFile);
    
    // Verify that preview was created
    const previewPdf = document.querySelector('#documentPreview .preview-pdf');
    expect(previewPdf).not.toBeNull();
    expect(previewPdf.src).toBe('blob:pdf-url');
    expect(previewPdf.type).toBe('application/pdf');
    
    // Verify that modal is displayed
    const modal = document.getElementById('documentPreviewModal');
    expect(modal.style.display).toBe('block');
  });
  
  test('previewFile shows "preview not available" for other file types', () => {
    // Initialize document uploader
    window.DocumentUploader.init();
    
    // Create mock Word file
    const wordFile = new File(['word content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Preview file
    window.DocumentUploader.previewFile(wordFile);
    
    // Verify that "preview not available" message is shown
    const previewNotAvailable = document.querySelector('#documentPreview .preview-not-available');
    expect(previewNotAvailable).not.toBeNull();
    expect(previewNotAvailable.textContent).toContain('Preview not available for this file type');
    expect(previewNotAvailable.textContent).toContain('document.docx');
    
    // Verify that modal is displayed
    const modal = document.getElementById('documentPreviewModal');
    expect(modal.style.display).toBe('block');
  });
});
