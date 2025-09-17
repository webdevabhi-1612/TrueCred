// TrueCred Public Portal - Interactive Functionality
class PublicPortal {
    constructor() {
        this.uploadedFile = null;
        this.isAnalyzing = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupCounters();
        this.setupUpload();
        this.setupLookupTabs();
        this.setupEventListeners();
        this.startLiveUpdates();
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAnimations() {
        // GSAP animations for page load
        const tl = gsap.timeline();
        
        tl.from('.hero-badge', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: 'power2.out'
        })
        .from('.hero-title', {
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-description', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: 'power2.out'
        }, '-=0.7')
        .from('.stat-item', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.certificate-card', {
            duration: 0.8,
            opacity: 0,
            scale: 0.8,
            stagger: 0.3,
            ease: 'power2.out'
        }, '-=0.3');

        // Scroll-triggered animations
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.upload-card, .demo-section').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                y: 50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            });
        });

        gsap.utils.toArray('.step-item').forEach((step, i) => {
            gsap.from(step, {
                duration: 0.6,
                opacity: 0,
                y: 30,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%'
                }
            });
        });

        gsap.utils.toArray('.stat-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.6,
                opacity: 0,
                x: -50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            });
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.live-counter, .stat-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (target) {
                ScrollTrigger.create({
                    trigger: counter,
                    start: 'top 80%',
                    once: true,
                    onEnter: () => {
                        gsap.to(counter, {
                            duration: 2.5,
                            innerHTML: target,
                            ease: 'power2.out',
                            snap: { innerHTML: 1 },
                            onUpdate: function() {
                                counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
                            }
                        });
                    }
                });
            }
        });
    }

    setupUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const browseLink = document.getElementById('browseLink');
        const verifyBtn = document.getElementById('verifyBtn');

        // Drag and drop functionality
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(files[0]);
        });

        // Click to browse
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        browseLink.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        verifyBtn.addEventListener('click', () => {
            if (this.uploadedFile) {
                this.startVerification(this.uploadedFile.name, 'uploaded');
            }
        });
    }

    handleFileUpload(file) {
        // Validate file type and size
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            this.showNotification('Please upload a valid PDF or image file', 'error');
            return;
        }

        if (file.size > maxSize) {
            this.showNotification('File size must be less than 10MB', 'error');
            return;
        }

        this.uploadedFile = file;
        this.updateUploadUI(file);
        this.showNotification(`File "${file.name}" uploaded successfully!`, 'success');
    }

    updateUploadUI(file) {
        const uploadZone = document.getElementById('uploadZone');
        const verifyBtn = document.getElementById('verifyBtn');

        uploadZone.innerHTML = `
            <div class="upload-zone-content">
                <div class="file-preview">
                    <div class="file-icon">${this.getFileIcon(file.type)}</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                        <div class="file-status">Ready for verification</div>
                    </div>
                    <button class="file-remove" onclick="publicPortal.removeFile()">✕</button>
                </div>
            </div>
        `;

        verifyBtn.disabled = false;
        
        // Add styles for file preview
        const style = document.createElement('style');
        style.textContent = `
            .file-preview {
                display: flex;
                align-items: center;
                gap: 2rem;
                padding: 2rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                position: relative;
            }
            .file-icon {
                font-size: 4rem;
            }
            .file-info {
                flex: 1;
                text-align: left;
            }
            .file-name {
                font-size: 1.6rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            .file-size {
                font-size: 1.4rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            .file-status {
                font-size: 1.3rem;
                color: var(--success-color);
                font-weight: 500;
            }
            .file-remove {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: var(--error-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
                cursor: pointer;
                font-size: 1.4rem;
                transition: var(--transition-fast);
            }
            .file-remove:hover {
                background: var(--critical-color);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }

    removeFile() {
        this.uploadedFile = null;
        const uploadZone = document.getElementById('uploadZone');
        const verifyBtn = document.getElementById('verifyBtn');

        uploadZone.innerHTML = `
            <div class="upload-zone-content">
                <div class="upload-icon-container">
                    <div class="upload-icon">📄</div>
                    <div class="upload-pulse"></div>
                </div>
                <div class="upload-text">
                    <h4>Drop your certificate here</h4>
                    <p>or <span class="browse-link" id="browseLink">browse files</span> from your device</p>
                </div>
                <div class="upload-formats">
                    <span class="format-tag">PDF</span>
                    <span class="format-tag">JPG</span>
                    <span class="format-tag">PNG</span>
                </div>
            </div>
        `;

        verifyBtn.disabled = true;
        this.setupUpload(); // Re-initialize upload functionality
    }

    getFileIcon(type) {
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('image/')) return '🖼️';
        return '📎';
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    setupLookupTabs() {
        const tabs = document.querySelectorAll('.lookup-tab');
        const panels = document.querySelectorAll('.lookup-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-tab');

                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                document.getElementById(`${targetPanel}-panel`).classList.add('active');
            });
        });

        // Setup search functionality
        document.querySelectorAll('.search-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.performSearch();
            });
        });
    }

    performSearch() {
        this.showNotification('Search functionality will be available in the full version', 'info');
    }

    setupEventListeners() {
        // Demo sample buttons
        window.loadDemoSample = (type) => {
            this.startVerification(`demo-${type}.pdf`, type);
        };

        // Navigation functions
        window.openGovernmentPortal = () => {
            window.open('government.html', '_blank');
        };

        window.openLogin = () => {
            window.open('login.html', '_blank');
        };

        // Modal close functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });
    }

    startVerification(filename, type) {
        if (this.isAnalyzing) return;
        
        this.isAnalyzing = true;
        this.showVerificationModal(filename, type);
    }

    showVerificationModal(filename, type) {
        const modal = document.getElementById('resultsModal');
        const modalContent = document.getElementById('resultsContent');

        modalContent.innerHTML = `
            <div class="verification-process">
                <div class="verification-header">
                    <h4>Analyzing: ${filename}</h4>
                    <div class="verification-time">Started at ${new Date().toLocaleTimeString()}</div>
                </div>
                
                <div class="verification-steps">
                    <div class="step-progress" data-step="upload">
                        <div class="step-icon">📤</div>
                        <div class="step-info">
                            <div class="step-title">File Upload</div>
                            <div class="step-status">Complete</div>
                        </div>
                        <div class="step-indicator complete"></div>
                    </div>
                    
                    <div class="step-progress" data-step="ocr">
                        <div class="step-icon">🔤</div>
                        <div class="step-info">
                            <div class="step-title">OCR Text Extraction</div>
                            <div class="step-status">Processing...</div>
                        </div>
                        <div class="step-indicator processing"></div>
                    </div>
                    
                    <div class="step-progress" data-step="ai">
                        <div class="step-icon">🧠</div>
                        <div class="step-info">
                            <div class="step-title">AI Fraud Detection</div>
                            <div class="step-status">Waiting...</div>
                        </div>
                        <div class="step-indicator waiting"></div>
                    </div>
                    
                    <div class="step-progress" data-step="blockchain">
                        <div class="step-icon">⛓️</div>
                        <div class="step-info">
                            <div class="step-title">Blockchain Verification</div>
                            <div class="step-status">Waiting...</div>
                        </div>
                        <div class="step-indicator waiting"></div>
                    </div>
                </div>
                
                <div class="overall-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="overallProgress"></div>
                    </div>
                    <div class="progress-text">Processing certificate...</div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        // Add verification styles
        this.addVerificationStyles();

        // Simulate verification process
        this.simulateVerification(type);
    }

    addVerificationStyles() {
        const style = document.createElement('style');
        style.id = 'verification-styles';
        style.textContent = `
            .verification-process {
                padding: 2rem 0;
            }
            .verification-header {
                text-align: center;
                margin-bottom: 3rem;
                padding-bottom: 2rem;
                border-bottom: 1px solid var(--border-light);
            }
            .verification-header h4 {
                font-size: 2rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            .verification-time {
                font-size: 1.3rem;
                color: var(--text-secondary);
            }
            .verification-steps {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                margin-bottom: 3rem;
            }
            .step-progress {
                display: flex;
                align-items: center;
                gap: 2rem;
                padding: 1.5rem;
                background: var(--bg-tertiary);
                border-radius: var(--border-radius);
                transition: var(--transition);
            }
            .step-progress.active {
                background: rgba(30, 64, 175, 0.1);
                border: 1px solid rgba(30, 64, 175, 0.2);
            }
            .step-icon {
                font-size: 2.4rem;
                min-width: 2.4rem;
            }
            .step-info {
                flex: 1;
            }
            .step-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.3rem;
            }
            .step-status {
                font-size: 1.3rem;
                color: var(--text-secondary);
            }
            .step-indicator {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                position: relative;
            }
            .step-indicator.complete {
                background: var(--success-color);
            }
            .step-indicator.complete::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
            }
            .step-indicator.processing {
                background: var(--warning-color);
                animation: pulse 2s infinite;
            }
            .step-indicator.waiting {
                background: var(--border-color);
            }
            .overall-progress {
                text-align: center;
            }
            .progress-bar {
                width: 100%;
                height: 0.8rem;
                background: var(--bg-tertiary);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 25%;
            }
            .progress-text {
                font-size: 1.4rem;
                color: var(--text-secondary);
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }

    async simulateVerification(type) {
        const steps = ['upload', 'ocr', 'ai', 'blockchain'];
        const progressFill = document.getElementById('overallProgress');
        const progressText = document.querySelector('.progress-text');

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepElement = document.querySelector(`[data-step="${step}"]`);
            const stepStatus = stepElement.querySelector('.step-status');
            const stepIndicator = stepElement.querySelector('.step-indicator');

            // Activate current step
            stepElement.classList.add('active');
            stepStatus.textContent = 'Processing...';
            stepIndicator.className = 'step-indicator processing';

            // Update overall progress
            const progress = ((i + 1) / steps.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Processing step ${i + 1} of ${steps.length}...`;

            // Wait for step completion
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Complete current step
            stepStatus.textContent = 'Complete';
            stepIndicator.className = 'step-indicator complete';
            stepElement.classList.remove('active');
        }

        // Show results
        setTimeout(() => {
            this.showVerificationResults(type);
        }, 1000);
    }

    showVerificationResults(type) {
        const modalContent = document.getElementById('resultsContent');
        const results = this.getVerificationResults(type);

        modalContent.innerHTML = `
            <div class="verification-results">
                <div class="result-header">
                    <div class="result-status ${results.status}">
                        <div class="status-icon">${results.icon}</div>
                        <div class="status-text">${results.statusText}</div>
                    </div>
                    <div class="confidence-score">
                        <div class="confidence-label">AI Confidence</div>
                        <div class="confidence-value">${results.confidence}%</div>
                    </div>
                </div>
                
                <div class="result-details">
                    <div class="detail-section">
                        <h5>Certificate Information</h5>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Student Name:</span>
                                <span class="detail-value">${results.studentName}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Institution:</span>
                                <span class="detail-value">${results.institution}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Degree:</span>
                                <span class="detail-value">${results.degree}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Issue Date:</span>
                                <span class="detail-value">${results.issueDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Verification Analysis</h5>
                        <div class="analysis-grid">
                            <div class="analysis-item">
                                <span class="analysis-label">OCR Accuracy:</span>
                                <span class="analysis-value">${results.ocrAccuracy}%</span>
                            </div>
                            <div class="analysis-item">
                                <span class="analysis-label">Signature Match:</span>
                                <span class="analysis-value">${results.signatureMatch}</span>
                            </div>
                            <div class="analysis-item">
                                <span class="analysis-label">Watermark Check:</span>
                                <span class="analysis-value">${results.watermark}</span>
                            </div>
                            <div class="analysis-item">
                                <span class="analysis-label">Blockchain Status:</span>
                                <span class="analysis-value">${results.blockchain}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${results.anomalies.length > 0 ? `
                        <div class="detail-section">
                            <h5>Detected Anomalies</h5>
                            <div class="anomalies-list">
                                ${results.anomalies.map(anomaly => `
                                    <div class="anomaly-item ${results.status}">
                                        <span class="anomaly-icon">⚠️</span>
                                        <span class="anomaly-text">${anomaly}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="result-actions">
                    <button class="btn-primary" onclick="publicPortal.downloadReport()">
                        <span>Download Report</span>
                        <span>📄</span>
                    </button>
                    <button class="btn-secondary" onclick="publicPortal.shareResults()">
                        <span>Share Results</span>
                        <span>📤</span>
                    </button>
                    <button class="btn-outline" onclick="publicPortal.verifyAnother()">
                        <span>Verify Another</span>
                    </button>
                </div>
            </div>
        `;

        // Add result styles
        this.addResultStyles();
        this.isAnalyzing = false;
    }

    getVerificationResults(type) {
        const results = {
            valid: {
                status: 'valid',
                icon: '✅',
                statusText: 'CERTIFICATE VERIFIED',
                confidence: 98,
                studentName: 'Rahul Kumar Singh',
                institution: 'NIT Jamshedpur',
                degree: 'Bachelor of Technology (Computer Science)',
                issueDate: 'June 15, 2024',
                ocrAccuracy: 97,
                signatureMatch: 'Verified',
                watermark: 'Authentic',
                blockchain: 'Confirmed',
                anomalies: []
            },
            suspicious: {
                status: 'suspicious',
                icon: '⚠️',
                statusText: 'CERTIFICATE SUSPICIOUS',
                confidence: 67,
                studentName: 'Priya Sharma',
                institution: 'Ranchi University',
                degree: 'Master of Business Administration',
                issueDate: 'March 20, 2023',
                ocrAccuracy: 89,
                signatureMatch: 'Partial Match',
                watermark: 'Questionable',
                blockchain: 'Not Found',
                anomalies: ['Grade alterations detected', 'Signature inconsistency', 'Date format irregularity']
            },
            fraudulent: {
                status: 'fraudulent',
                icon: '❌',
                statusText: 'CERTIFICATE FRAUDULENT',
                confidence: 94,
                studentName: 'Unknown Person',
                institution: 'Fake University',
                degree: 'Diploma in Engineering',
                issueDate: 'Invalid Date',
                ocrAccuracy: 45,
                signatureMatch: 'No Match',
                watermark: 'Fake',
                blockchain: 'Rejected',
                anomalies: ['Institution not recognized', 'Forged signatures', 'Invalid watermarks', 'Incorrect certificate format']
            }
        };

        return results[type] || results.valid;
    }

    addResultStyles() {
        const style = document.createElement('style');
        style.id = 'result-styles';
        style.textContent = `
            .verification-results {
                padding: 2rem 0;
            }
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 3rem;
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                background: var(--bg-tertiary);
            }
            .result-status {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .status-icon {
                font-size: 3rem;
            }
            .status-text {
                font-size: 2rem;
                font-weight: 700;
            }
            .result-status.valid .status-text {
                color: var(--success-color);
            }
            .result-status.suspicious .status-text {
                color: var(--warning-color);
            }
            .result-status.fraudulent .status-text {
                color: var(--error-color);
            }
            .confidence-score {
                text-align: center;
            }
            .confidence-label {
                font-size: 1.3rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            .confidence-value {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 2.8rem;
                font-weight: 700;
                color: var(--primary-color);
            }
            .detail-section {
                margin-bottom: 3rem;
                padding: 2rem;
                background: white;
                border-radius: var(--border-radius);
                border: 1px solid var(--border-light);
            }
            .detail-section h5 {
                font-size: 1.8rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border-light);
            }
            .detail-grid, .analysis-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }
            .detail-item, .analysis-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                border-bottom: 1px solid var(--border-light);
            }
            .detail-label, .analysis-label {
                font-size: 1.4rem;
                color: var(--text-secondary);
            }
            .detail-value, .analysis-value {
                font-size: 1.4rem;
                font-weight: 500;
                color: var(--text-primary);
            }
            .anomalies-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .anomaly-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.2rem;
                border-radius: var(--border-radius);
            }
            .anomaly-item.suspicious {
                background: rgba(245, 158, 11, 0.1);
                border: 1px solid rgba(245, 158, 11, 0.2);
            }
            .anomaly-item.fraudulent {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
            }
            .anomaly-icon {
                font-size: 1.6rem;
            }
            .anomaly-text {
                font-size: 1.4rem;
                color: var(--text-primary);
            }
            .result-actions {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            .result-actions .btn-primary,
            .result-actions .btn-secondary,
            .result-actions .btn-outline {
                min-width: 16rem;
            }
        `;
        document.head.appendChild(style);
    }

    downloadReport() {
        this.showNotification('Report download will be available in the full version', 'info');
    }

    shareResults() {
        this.showNotification('Results sharing will be available in the full version', 'info');
    }

    verifyAnother() {
        this.closeModal();
        this.removeFile();
        document.getElementById('verify').scrollIntoView({ behavior: 'smooth' });
    }

    closeModal() {
        const modal = document.getElementById('resultsModal');
        modal.style.display = 'none';
        
        // Clean up styles
        const verificationStyles = document.getElementById('verification-styles');
        const resultStyles = document.getElementById('result-styles');
        if (verificationStyles) verificationStyles.remove();
        if (resultStyles) resultStyles.remove();
        
        this.isAnalyzing = false;
    }

    startLiveUpdates() {
        // Update live counters periodically
        setInterval(() => {
            this.updateLiveCounters();
        }, 5000);
    }
    updateLiveCounters() {
        const counters = document.querySelectorAll('.live-counter');
        counters.forEach(counter => {
            const currentValue = parseInt(counter.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 10) + 1; // Random increment 1-10
            const newValue = currentValue + increment;
            
            // Animate counter update
            gsap.to(counter, {
                duration: 1.5,
                innerHTML: newValue,
                ease: 'power2.out',
                snap: { innerHTML: 1 },
                onUpdate: function() {
                    counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
                }
            });
        });
        
        // Update certificate cards in hero section
        this.updateCertificateCards();
    }

    updateCertificateCards() {
        const processingCard = document.querySelector('.certificate-card.processing');
        if (processingCard) {
            const progressBar = processingCard.querySelector('.progress-fill');
            if (progressBar) {
                const currentWidth = parseInt(progressBar.style.width) || 0;
                const newWidth = Math.min(currentWidth + Math.floor(Math.random() * 15) + 5, 100);
                
                gsap.to(progressBar, {
                    duration: 2,
                    width: `${newWidth}%`,
                    ease: 'power2.out'
                });
                
                // If progress reaches 100%, switch to verified
                if (newWidth >= 100) {
                    setTimeout(() => {
                        processingCard.className = 'certificate-card valid';
                        processingCard.querySelector('.cert-status').innerHTML = '✅ VERIFIED';
                        processingCard.querySelector('.cert-confidence').textContent = 'AI Confidence: 96.8%';
                        
                        // Reset after 5 seconds
                        setTimeout(() => {
                            processingCard.className = 'certificate-card processing';
                            processingCard.querySelector('.cert-status').innerHTML = '⏳ ANALYZING';
                            processingCard.querySelector('.cert-confidence').innerHTML = '<div class="processing-bar"><div class="progress-fill"></div></div>';
                        }, 5000);
                    }, 2000);
                }
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${this.getNotificationIcon(type)}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    z-index: 10001;
                    min-width: 30rem;
                    max-width: 40rem;
                    background: white;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-xl);
                    border-left: 4px solid var(--primary-color);
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success {
                    border-left-color: var(--success-color);
                }
                .notification-warning {
                    border-left-color: var(--warning-color);
                }
                .notification-error {
                    border-left-color: var(--error-color);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem 2rem;
                }
                .notification-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }
                .notification-message {
                    flex: 1;
                    font-size: 1.4rem;
                    color: var(--text-primary);
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.8rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.5rem;
                    flex-shrink: 0;
                }
                .notification-close:hover {
                    color: var(--text-primary);
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                gsap.to(notification, {
                    duration: 0.3,
                    x: '100%',
                    opacity: 0,
                    ease: 'power2.in',
                    onComplete: () => notification.remove()
                });
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    // Utility function for smooth page transitions
    navigateToPage(url) {
        gsap.to('body', {
            duration: 0.3,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => {
                window.location.href = url;
            }
        });
    }

    // Enhanced scroll to section with offset
    scrollToSection(sectionId) {
        const target = document.querySelector(sectionId);
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            
            gsap.to(window, {
                duration: 1.2,
                scrollTo: targetPosition,
                ease: 'power2.out'
            });
        }
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            // Ctrl/Cmd + U to focus upload
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.getElementById('uploadZone').focus();
            }
            
            // Ctrl/Cmd + L to focus lookup
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.scrollToSection('#lookup');
            }
        });
    }

    // Performance monitoring
    trackUserInteraction(action, details = {}) {
        const interaction = {
            action: action,
            timestamp: new Date().toISOString(),
            page: 'public-portal',
            userAgent: navigator.userAgent,
            ...details
        };
        
        // In a real app, this would send to analytics
        console.log('User Interaction:', interaction);
        
        // Store in localStorage for demo purposes
        const interactions = JSON.parse(localStorage.getItem('truecred-interactions') || '[]');
        interactions.push(interaction);
        localStorage.setItem('truecred-interactions', JSON.stringify(interactions.slice(-100))); // Keep last 100
    }

    // Browser compatibility checks
    checkBrowserSupport() {
        const features = {
            fileAPI: 'FileReader' in window,
            dragDrop: 'draggable' in document.createElement('span'),
            localStorage: 'localStorage' in window,
            gsap: typeof gsap !== 'undefined'
        };

        const unsupported = Object.keys(features).filter(feature => !features[feature]);
        
        if (unsupported.length > 0) {
            this.showNotification(
                `Some features may not work properly. Unsupported: ${unsupported.join(', ')}`, 
                'warning'
            );
        }
    }

    // Initialize error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Portal Error:', e.error);
            this.showNotification('An unexpected error occurred. Please refresh the page.', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            e.preventDefault(); // Prevent default browser behavior
        });
    }

    // Clean up resources on page unload
    cleanup() {
        window.addEventListener('beforeunload', () => {
            // Cancel any ongoing animations
            gsap.killTweensOf('*');
            
            // Clear intervals
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            // Clean up event listeners
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        });
    }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is required for animations. Please include GSAP library.');
        return;
    }

    // Initialize the public portal
    window.publicPortal = new PublicPortal();
    
    // Setup additional features
    window.publicPortal.setupKeyboardShortcuts();
    window.publicPortal.checkBrowserSupport();
    window.publicPortal.setupErrorHandling();
    window.publicPortal.cleanup();
    
    // Track page load
    window.publicPortal.trackUserInteraction('page_load', {
        loadTime: performance.now(),
        referrer: document.referrer
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PublicPortal;
}
