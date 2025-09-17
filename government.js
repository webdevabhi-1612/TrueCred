// TrueCred Government Dashboard - Advanced Analytics & Real-time Controls
class GovernmentDashboard {
    constructor() {
        this.init();
        this.charts = {};
        this.realTimeData = {
            verifications: 1247,
            fraudCases: 127,
            institutions: 245,
            responseTime: 2.3
        };
        this.activityQueue = [];
        this.isUpdating = false;
        this.notificationPanel = null;
    }

    init() {
        this.initLocomotiveScroll();
        this.initGSAP();
        this.setupNavigation();
        this.setupAnimations();
        this.setupCounters();
        this.setupCharts();
        this.startRealTimeUpdates();
        this.setupInteractions();
        this.initializeActivityFeed();
    }

    initLocomotiveScroll() {
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            class: 'is-reveal',
            smartphone: {
                smooth: true,
                direction: 'vertical',
                horizontalGesture: false
            }
        });

        this.scroll.on('scroll', () => {
            ScrollTrigger.update();
        });

        ScrollTrigger.scrollerProxy('[data-scroll-container]', {
            scrollTop(value) {
                return arguments.length ? 
                    this.scroll.scrollTo(value, 0, 0) : 
                    this.scroll.scroll.instance.scroll.y;
            }.bind(this),
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
        });

        ScrollTrigger.addEventListener('refresh', () => this.scroll.update());
        ScrollTrigger.refresh();
    }

    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Set default animations
        gsap.set('[data-scroll-delay]', { 
            opacity: 0, 
            y: 50 
        });
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: navbar },
            scroller: '[data-scroll-container]'
        });

        // Active nav link management
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Smooth scroll to target
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.scroll.scrollTo(target);
                }
            });
        });

        // Notification bell click
        const notificationBell = document.querySelector('.notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                this.showNotificationPanel();
            });
        }
    }

    setupAnimations() {
        // Hero animations
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
        .from('.stat-card', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-actions .btn-primary-large, .hero-actions .btn-secondary-large', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.3');

        // Preview cards animation
        gsap.to('.preview-card', {
            duration: 8,
            y: -15,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            stagger: {
                each: 2.5,
                repeat: -1
            }
        });

        // Section animations
        gsap.utils.toArray('.overview-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                x: -50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });

        gsap.utils.toArray('.compliance-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                y: 50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });

        gsap.utils.toArray('.chart-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                scale: 0.9,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });

        gsap.utils.toArray('.policy-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target], .stat-value[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                scroller: '[data-scroll-container]',
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
        });
    }

    setupCharts() {
        // Verification Trends Chart (Multi-line)
        const verificationsCtx = document.getElementById('verificationsChart');
        if (verificationsCtx) {
            this.charts.verifications = new Chart(verificationsCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                    datasets: [{
                        label: 'Total Verifications',
                        data: [120, 89, 340, 580, 620, 450, 280],
                        borderColor: '#1e40af',
                        backgroundColor: 'rgba(30, 64, 175, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#1e40af',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }, {
                        label: 'Fraud Cases',
                        data: [2, 1, 8, 12, 15, 9, 5],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }, {
                        label: 'AI Processing',
                        data: [115, 87, 325, 555, 590, 430, 270],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: '#1e40af',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: '#f1f5f9',
                                drawBorder: false 
                            },
                            ticks: { 
                                color: '#6b7280',
                                font: { size: 11 }
                            }
                        },
                        x: {
                            grid: { 
                                color: '#f1f5f9',
                                drawBorder: false 
                            },
                            ticks: { 
                                color: '#6b7280',
                                font: { size: 11 }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }

        // Fraud Detection Pie Chart
        const fraudCtx = document.getElementById('fraudChart');
        if (fraudCtx) {
            this.charts.fraud = new Chart(fraudCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Fake Degrees', 'Grade Manipulation', 'Institution Forgery'],
                    datasets: [{
                        data: [68, 34, 25],
                        backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6'],
                        borderWidth: 0,
                        cutout: '60%',
                        hoverBorderWidth: 2,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed * 100) / total).toFixed(1);
                                    return `${context.label}: ${context.parsed} cases (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Performance Chart (Radar)
        const performanceCtx = document.getElementById('performanceChart');
        if (performanceCtx) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'radar',
                data: {
                    labels: ['OCR Engine', 'AI Detection', 'Blockchain', 'Database', 'Network', 'Security'],
                    datasets: [{
                        label: 'Current Performance',
                        data: [94, 98, 100, 76, 89, 95],
                        backgroundColor: 'rgba(30, 64, 175, 0.2)',
                        borderColor: '#1e40af',
                        borderWidth: 2,
                        pointBackgroundColor: '#1e40af',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }, {
                        label: 'Target Performance',
                        data: [95, 99, 100, 85, 95, 98],
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: '#10b981',
                        borderWidth: 2,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                font: { size: 11 },
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { 
                                color: '#f1f5f9' 
                            },
                            angleLines: { 
                                color: '#e2e8f0' 
                            },
                            pointLabels: { 
                                color: '#6b7280', 
                                font: { size: 11 }
                            },
                            ticks: {
                                color: '#9ca3af',
                                font: { size: 10 },
                                backdropColor: 'transparent'
                            }
                        }
                    }
                }
            });
        }

        // Institution Bar Chart
        const institutionCtx = document.getElementById('institutionChart');
        if (institutionCtx) {
            this.charts.institution = new Chart(institutionCtx, {
                type: 'bar',
                data: {
                    labels: ['Universities', 'Colleges', 'Technical\nInstitutes', 'Professional\nSchools', 'Research\nCenters'],
                    datasets: [{
                        label: 'Total Institutions',
                        data: [23, 187, 35, 42, 8],
                        backgroundColor: ['#1e40af', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
                        borderRadius: 6,
                        borderSkipped: false
                    }, {
                        label: 'Compliant',
                        data: [23, 176, 30, 41, 8],
                        backgroundColor: [
                            'rgba(30, 64, 175, 0.3)', 
                            'rgba(59, 130, 246, 0.3)', 
                            'rgba(245, 158, 11, 0.3)', 
                            'rgba(16, 185, 129, 0.3)', 
                            'rgba(139, 92, 246, 0.3)'
                        ],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 11 }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: '#f1f5f9',
                                drawBorder: false 
                            },
                            ticks: { 
                                color: '#6b7280',
                                font: { size: 11 }
                            }
                        },
                        x: {
                            grid: { 
                                display: false 
                            },
                            ticks: { 
                                color: '#6b7280',
                                maxRotation: 0,
                                font: { size: 10 }
                            }
                        }
                    }
                }
            });
        }

        // Chart period controls
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from siblings
                const siblings = btn.parentElement.querySelectorAll('.chart-btn');
                siblings.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update chart based on period
                this.updateChart(btn.dataset.period);
            });
        });

        // Real-time updates for charts
        this.startChartUpdates();
    }

    updateChart(period) {
        const data = {
            day: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                verifications: [120, 89, 340, 580, 620, 450, 280],
                fraud: [2, 1, 8, 12, 15, 9, 5],
                processing: [115, 87, 325, 555, 590, 430, 270]
            },
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                verifications: [2500, 3200, 2800, 3500, 4100, 2200, 1800],
                fraud: [25, 38, 31, 42, 48, 22, 18],
                processing: [2400, 3100, 2700, 3350, 3900, 2100, 1750]
            },
            month: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                verifications: [8500, 12000, 15000, 18500],
                fraud: [85, 142, 178, 201],
                processing: [8200, 11800, 14700, 18100]
            },
            year: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                verifications: [145000, 162000, 158000, 185000],
                fraud: [1450, 1680, 1720, 1890],
                processing: [142000, 159000, 155000, 181000]
            }
        };

        if (this.charts.verifications && data[period]) {
            this.charts.verifications.data.labels = data[period].labels;
            this.charts.verifications.data.datasets[0].data = data[period].verifications;
            this.charts.verifications.data.datasets[1].data = data[period].fraud;
            this.charts.verifications.data.datasets[2].data = data[period].processing;
            this.charts.verifications.update('active');
        }
    }

    startChartUpdates() {
        // Update charts every 30 seconds with new data
        setInterval(() => {
            this.updateChartsWithRealTimeData();
        }, 30000);
    }

    updateChartsWithRealTimeData() {
        // Add new data points to verification chart
        if (this.charts.verifications) {
            const newVerifications = Math.floor(Math.random() * 100) + 200;
            const newFraud = Math.floor(Math.random() * 5) + 1;
            const newProcessing = Math.floor(newVerifications * 0.95);
            
            this.charts.verifications.data.datasets[0].data.push(newVerifications);
            this.charts.verifications.data.datasets[1].data.push(newFraud);
            this.charts.verifications.data.datasets[2].data.push(newProcessing);
            
            // Keep only last 10 data points
            if (this.charts.verifications.data.datasets[0].data.length > 10) {
                this.charts.verifications.data.datasets[0].data.shift();
                this.charts.verifications.data.datasets[1].data.shift();
                this.charts.verifications.data.datasets[2].data.shift();
                this.charts.verifications.data.labels.shift();
            }
            
            // Add new time label
            const now = new Date();
            const timeLabel = now.getHours().toString().padStart(2, '0') + ':' + 
                             now.getMinutes().toString().padStart(2, '0');
            this.charts.verifications.data.labels.push(timeLabel);
            
            this.charts.verifications.update('none');
        }
        
        // Update fraud pie chart occasionally
        if (Math.random() > 0.7 && this.charts.fraud) {
            const datasets = this.charts.fraud.data.datasets[0];
            const randomIndex = Math.floor(Math.random() * datasets.data.length);
            datasets.data[randomIndex] += Math.floor(Math.random() * 3) + 1;
            this.charts.fraud.update('active');
        }

        // Update performance radar chart
        if (Math.random() > 0.8 && this.charts.performance) {
            const currentData = this.charts.performance.data.datasets[0].data;
            currentData.forEach((value, index) => {
                const variation = (Math.random() - 0.5) * 4; // ±2% variation
                currentData[index] = Math.max(80, Math.min(100, value + variation));
            });
            this.charts.performance.update('none');
        }
    }

    startRealTimeUpdates() {
        // Update live verification counter
        setInterval(() => {
            this.updateLiveVerifications();
        }, 5000);

        // Update fraud alerts
        setInterval(() => {
            this.updateFraudAlerts();
        }, 15000);

        // Update notifications
        setInterval(() => {
            this.updateNotifications();
        }, 8000);

        // Update activity feed
        setInterval(() => {
            this.updateActivityFeed();
        }, 3000);
    }

    updateLiveVerifications() {
        const counter = document.querySelector('.verification-counter .counter-number');
        if (counter) {
            const current = parseInt(counter.textContent.replace(',', ''));
            const increment = Math.floor(Math.random() * 10) + 1;
            const newValue = current + increment;
            
            gsap.to(counter, {
                duration: 0.5,
                innerHTML: newValue,
                ease: 'power2.out',
                onUpdate: function() {
                    counter.innerHTML = Math.ceil(counter.innerHTML).toLocaleString();
                }
            });
        }

        // Update processing stat
        const processingValue = document.querySelector('.overview-card.processing .stat-value');
        if (processingValue && processingValue.hasAttribute('data-target')) {
            const increment = Math.floor(Math.random() * 20) + 5;
            const newValue = parseInt(processingValue.textContent) + increment;
            
            gsap.to(processingValue, {
                duration: 0.5,
                innerHTML: newValue,
                ease: 'power2.out'
            });
        }
    }

    updateFraudAlerts() {
        const alertMetric = document.querySelector('.alert-metric');
        if (alertMetric) {
            const current = parseInt(alertMetric.textContent);
            if (Math.random() > 0.6) { // 40% chance of new fraud case
                const newValue = current + 1;
                
                gsap.to(alertMetric, {
                    duration: 0.5,
                    innerHTML: newValue,
                    ease: 'power2.out',
                    onComplete: () => {
                        // Flash effect for new alert
                        gsap.to('.fraud-alert', {
                            duration: 0.2,
                            scale: 1.05,
                            yoyo: true,
                            repeat: 1,
                            ease: 'power2.out'
                        });
                    }
                });

                // Update main fraud counter
                const fraudCounter = document.querySelector('.stat-card.urgent .stat-number');
                if (fraudCounter) {
                    fraudCounter.textContent = newValue;
                }

                // Add to activity feed
                this.addActivityItem({
                    type: 'fraud',
                    icon: '⚠️',
                    title: 'Fraud Alert Triggered',
                    details: 'Suspicious certificate flagged',
                    time: 'Just now'
                });

                // Update notification count
                this.incrementNotificationCount();
            }
        }
    }

    updateNotifications() {
        // Simulate incoming notifications
        if (Math.random() > 0.7) { // 30% chance
            this.incrementNotificationCount();
        }
    }

    incrementNotificationCount() {
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            const current = parseInt(notificationCount.textContent);
            notificationCount.textContent = current + 1;
            
            // Animate notification bell
            gsap.to('.notification-bell', {
                duration: 0.3,
                scale: 1.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });
        }
    }

    initializeActivityFeed() {
        const initialActivities = [
            {
                type: 'verified',
                icon: '✅',
                title: 'Certificate Verified',
                details: 'B.Tech - NIT Jamshedpur',
                time: '2 seconds ago'
            },
            {
                type: 'processing',
                icon: '⏳',
                title: 'AI Analysis in Progress',
                details: 'MBA - Ranchi University',
                time: '5 seconds ago'
            },
            {
                type: 'fraud',
                icon: '⚠️',
                title: 'Fraud Alert Triggered',
                details: 'Fake signature detected',
                time: '12 seconds ago'
            },
            {
                type: 'blockchain',
                icon: '⛓️',
                title: 'Blockchain Entry Created',
                details: 'Block #847592 confirmed',
                time: '18 seconds ago'
            },
            {
                type: 'verified',
                icon: '✅',
                title: 'Batch Verification Complete',
                details: '45 certificates processed',
                time: '32 seconds ago'
            }
        ];

        // Initialize activity feed with initial data
        this.activityQueue = initialActivities;
        this.renderActivityFeed();
    }

    addActivityItem(activity) {
        this.activityQueue.unshift(activity);
        
        // Keep only last 20 activities
        if (this.activityQueue.length > 20) {
            this.activityQueue = this.activityQueue.slice(0, 20);
        }
        
        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const activityStream = document.querySelector('.activity-stream');
        if (!activityStream) return;

        activityStream.innerHTML = '';
        
        this.activityQueue.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = `activity-item ${activity.type}`;
            activityElement.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-details">${activity.details}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            
            activityStream.appendChild(activityElement);
            
            // Animate new items
            if (index === 0) {
                gsap.from(activityElement, {
                    duration: 0.5,
                    x: 50,
                    opacity: 0,
                    ease: 'power2.out'
                });
            }
        });
    }

    updateActivityFeed() {
        const activities = [
            {
                type: 'verified',
                icon: '✅',
                title: 'Certificate Verified',
                details: `${this.getRandomDegree()} - ${this.getRandomInstitution()}`,
                time: 'Just now'
            },
            {
                type: 'processing',
                icon: '⏳',
                title: 'AI Analysis in Progress',
                details: `${this.getRandomDegree()} - ${this.getRandomInstitution()}`,
                time: 'Just now'
            },
            {
                type: 'blockchain',
                icon: '⛓️',
                title: 'Blockchain Entry Created',
                details: `Block #${Math.floor(Math.random() * 900000) + 100000} confirmed`,
                time: 'Just now'
            }
        ];

        if (Math.random() > 0.4) { // 60% chance of new activity
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            this.addActivityItem(randomActivity);
            
            // Update times for existing activities
            this.activityQueue.forEach((activity, index) => {
                if (index > 0) {
                    const seconds = Math.floor(Math.random() * 60) + (index * 10);
                    activity.time = seconds < 60 ? `${seconds} seconds ago` : `${Math.floor(seconds/60)} minutes ago`;
                }
            });
        }
    }

    getRandomDegree() {
        const degrees = ['B.Tech', 'MBA', 'M.Tech', 'B.Com', 'M.Com', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'BA', 'MA'];
        return degrees[Math.floor(Math.random() * degrees.length)];
    }

    getRandomInstitution() {
        const institutions = [
            'NIT Jamshedpur', 'Ranchi University', 'BIT Mesra', 'XLRI Jamshedpur',
            'Dhanbad Technical College', 'Bokaro Engineering College', 'Hazaribagh University',
            'Kolhan University', 'Central University Jharkhand', 'ISM Dhanbad'
        ];
        return institutions[Math.floor(Math.random() * institutions.length)];
    }

    setupInteractions() {
        // District hover effects
        document.querySelectorAll('.district-advanced').forEach(district => {
            district.addEventListener('mouseenter', () => {
                gsap.to(district.querySelector('.district-marker'), {
                    duration: 0.3,
                    scale: 1.3,
                    ease: 'power2.out'
                });
            });
            
            district.addEventListener('mouseleave', () => {
                gsap.to(district.querySelector('.district-marker'), {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            });

            district.addEventListener('click', () => {
                const districtName = district.dataset.district;
                const verifications = district.dataset.verifications;
                this.showDistrictDetails(districtName, verifications);
            });
        });

        // Card hover effects
        document.querySelectorAll('.chart-card, .compliance-card, .policy-card, .overview-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -6,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    ease: 'power2.out'
                });
            });
        });

        // Action button effects
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    x: 5,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    x: 0,
                    ease: 'power2.out'
                });
            });
        });

        // Button click effects
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Create ripple effect
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.className = 'ripple';
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Time range selector
        const timeSelect = document.getElementById('timeRange');
        if (timeSelect) {
            timeSelect.addEventListener('change', (e) => {
                this.updateMapData(e.target.value);
            });
        }
    }

    showDistrictDetails(districtName, verifications) {
        const modal = this.createModal(`${districtName} District Details`, `
            <div class="district-details">
                <div class="detail-grid">
                    <div class="detail-stat">
                        <div class="stat-icon">📋</div>
                        <div class="stat-info">
                            <div class="stat-number">${parseInt(verifications).toLocaleString()}</div>
                            <div class="stat-label">Total Verifications</div>
                        </div>
                    </div>
                    <div class="detail-stat">
                        <div class="stat-icon">🏛️</div>
                        <div class="stat-info">
                            <div class="stat-number">${Math.floor(Math.random() * 50) + 10}</div>
                            <div class="stat-label">Active Institutions</div>
                        </div>
                    </div>
                    <div class="detail-stat">
                        <div class="stat-icon">⚠️</div>
                        <div class="stat-info">
                            <div class="stat-number">${Math.floor(Math.random() * 20) + 1}</div>
                            <div class="stat-label">Fraud Cases</div>
                        </div>
                    </div>
                    <div class="detail-stat">
                        <div class="stat-icon">📈</div>
                        <div class="stat-info">
                            <div class="stat-number">${(Math.random() * 30 + 10).toFixed(1)}%</div>
                            <div class="stat-label">Monthly Growth</div>
                        </div>
                    </div>
                </div>
                <div class="district-actions">
                    <button class="btn-primary" onclick="window.govDashboard.generateDistrictReport('${districtName}')">
                        Generate Report
                    </button>
                    <button class="btn-secondary" onclick="window.govDashboard.scheduleAudit('${districtName}')">
                        Schedule Audit
                    </button>
                </div>
            </div>
        `);
    }

    updateMapData(timeRange) {
        console.log(`Updating map data for ${timeRange}`);
        // Update district markers based on time range
        const districts = document.querySelectorAll('.district-advanced');
        districts.forEach(district => {
            const marker = district.querySelector('.district-marker');
            // Simulate different data for different time ranges
            const multiplier = timeRange === 'today' ? 0.1 : timeRange === 'week' ? 0.7 : 1;
            const baseValue = parseInt(district.dataset.verifications);
            const newValue = Math.floor(baseValue * multiplier);
            district.dataset.verifications = newValue;
            
            // Update popup content
            const popup = district.querySelector('.district-popup');
            if (popup) {
                const verificationStat = popup.querySelector('.popup-stat span:last-child');
                if (verificationStat) {
                    verificationStat.textContent = `${newValue.toLocaleString()} verifications`;
                }
            }
        });
        
        this.showNotification(`Map updated for ${timeRange}`, 'success');
    }

    showNotificationPanel() {
        if (this.notificationPanel) {
            this.closeNotificationPanel();
            return;
        }

        this.notificationPanel = document.createElement('div');
        this.notificationPanel.className = 'notification-panel';
        this.notificationPanel.innerHTML = `
            <div class="panel-header">
                <h3>Notifications</h3>
                <button class="panel-close">&times;</button>
            </div>
            <div class="panel-content">
                <div class="notification-item urgent">
                    <div class="notif-icon">⚠️</div>
                    <div class="notif-content">
                        <div class="notif-title">High Fraud Activity Detected</div>
                        <div class="notif-details">15 suspicious certificates flagged in Ranchi district</div>
                        <div class="notif-time">5 minutes ago</div>
                    </div>
                </div>
                <div class="notification-item info">
                    <div class="notif-icon">📊</div>
                    <div class="notif-content">
                        <div class="notif-title">Daily Report Generated</div>
                        <div class="notif-details">Compliance report for September 17, 2025 is ready</div>
                        <div class="notif-time">1 hour ago</div>
                    </div>
                </div>
                <div class="notification-item success">
                    <div class="notif-icon">✅</div>
                    <div class="notif-content">
                        <div class="notif-title">System Update Complete</div>
                        <div class="notif-details">AI detection engine updated to version 2.1.5</div>
                        <div class="notif-time">2 hours ago</div>
                    </div>
                </div>
                <div class="notification-item warning">
                    <div class="notif-icon">🔧</div>
                    <div class="notif-content">
                        <div class="notif-title">Maintenance Scheduled</div>
                        <div class="notif-details">Database maintenance on September 19, 2025 at 2:00 AM</div>
                        <div class="notif-time">1 day ago</div>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <button class="btn-outline-small" onclick="window.govDashboard.markAllAsRead()">Mark All as Read</button>
                <button class="btn-primary" onclick="window.govDashboard.viewAllNotifications()">View All</button>
            </div>
        `;

        document.body.appendChild(this.notificationPanel);

        // Position panel
        const bellRect = document.querySelector('.notification-bell').getBoundingClientRect();
        Object.assign(this.notificationPanel.style, {
            position: 'fixed',
            top: `${bellRect.bottom + 10}px`,
            right: '2rem',
            width: '35rem',
            maxHeight: '50rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            zIndex: '10000',
            border: '1px solid #e2e8f0'
        });

        // Add close functionality
        this.notificationPanel.querySelector('.panel-close').addEventListener('click', () => {
            this.closeNotificationPanel();
        });

        // Animate panel
        gsap.from(this.notificationPanel, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            ease: 'power2.out'
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', this.handleOutsideClick.bind(this));
        }, 100);
    }

    handleOutsideClick(e) {
        if (this.notificationPanel && !this.notificationPanel.contains(e.target) && !e.target.closest('.notification-bell')) {
            this.closeNotificationPanel();
        }
    }

    closeNotificationPanel() {
        if (this.notificationPanel) {
            gsap.to(this.notificationPanel, {
                duration: 0.2,
                opacity: 0,
                y: -20,
                ease: 'power2.out',
                onComplete: () => {
                    this.notificationPanel.remove();
                    this.notificationPanel = null;
                    document.removeEventListener('click', this.handleOutsideClick.bind(this));
                }
            });
        }
    }

    // Generate compliance report
    generateReport() {
        const modal = this.createModal('Generating Compliance Report', `
            <div class="report-generator">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-percentage">0%</div>
                </div>
                <div class="progress-text">Initializing report generation...</div>
            </div>
        `);

        const progressFill = modal.querySelector('.progress-fill');
        const progressText = modal.querySelector('.progress-text');
        const progressPercentage = modal.querySelector('.progress-percentage');

        const steps = [
            'Collecting data from institutions...',
            'Analyzing compliance metrics...',
            'Generating fraud detection reports...',
            'Compiling regulatory adherence data...',
            'Creating visualizations and charts...',
            'Finalizing comprehensive report...'
        ];

        let currentStep = 0;
        const updateProgress = () => {
            if (currentStep < steps.length) {
                const progress = ((currentStep + 1) / steps.length) * 100;
                progressText.textContent = steps[currentStep];
                progressPercentage.textContent = `${Math.round(progress)}%`;
                
                gsap.to(progressFill, {
                    duration: 1.5,
                    width: `${progress}%`,
                    ease: 'power2.out'
                });
                
                currentStep++;
                setTimeout(updateProgress, 2000);
            } else {
                progressText.textContent = 'Report generated successfully!';
                progressPercentage.textContent = '100%';
                
                setTimeout(() => {
                    this.closeModal(modal);
                    this.showNotification('Compliance report has been generated and sent to your email.', 'success');
                }, 1500);
            }
        };

        updateProgress();
    }

    generateDistrictReport(districtName) {
        this.showNotification(`Generating detailed report for ${districtName} district...`, 'info');
        this.closeModal(document.querySelector('.modal-overlay'));
    }

    scheduleAudit(districtName) {
        this.showNotification(`Audit scheduled for institutions in ${districtName} district.`, 'success');
        this.closeModal(document.querySelector('.modal-overlay'));
    }

    markAllAsRead() {
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = '0';
            notificationCount.style.display = 'none';
        }
        this.showNotification('All notifications marked as read', 'success');
        this.closeNotificationPanel();
    }

    viewAllNotifications() {
        this.showNotification('Opening full notifications center...', 'info');
        this.closeNotificationPanel();
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Style modal
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000'
        });

        const modalContent = modal.querySelector('.modal-content');
        Object.assign(modalContent.style, {
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        });

        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        gsap.from(modalContent, {
            duration: 0.4,
            scale: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });

        return modal;
    }

    closeModal(modal) {
        gsap.to(modal, {
            duration: 0.3,
            opacity: 0,
            ease: 'power2.out',
            onComplete: () => {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="toast-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            padding: '1.2rem 1.8rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: '10001',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            minWidth: '30rem',
            maxWidth: '50rem'
        });

        // Close button functionality
        notification.querySelector('.toast-close').addEventListener('click', () => {
            this.closeNotification(notification);
        });

        gsap.from(notification, {
            duration: 0.4,
            x: 100,
            opacity: 0,
            ease: 'power2.out'
        });

        // Auto close after 4 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 4000);
    }

    closeNotification(notification) {
        gsap.to(notification, {
            duration: 0.3,
            x: 100,
            opacity: 0,
            ease: 'power2.out',
            onComplete: () => {
                notification.remove();
            }
        });
    }

    // Performance monitoring
    monitorSystemHealth() {
        const performanceMetrics = {
            ocrEngine: Math.floor(Math.random() * 10) + 90,
            aiDetection: Math.floor(Math.random() * 5) + 95,
            blockchain: 100,
            database: Math.floor(Math.random() * 20) + 70,
            network: Math.floor(Math.random() * 15) + 85,
            security: Math.floor(Math.random() * 8) + 92
        };

        // Update performance meters
        Object.keys(performanceMetrics).forEach(metric => {
            const meter = document.querySelector(`[data-metric="${metric}"] .meter-fill`);
            if (meter) {
                const value = performanceMetrics[metric];
                meter.style.width = `${value}%`;
                
                // Update color based on performance
                if (value >= 90) {
                    meter.style.background = '#10b981';
                } else if (value >= 75) {
                    meter.style.background = '#f59e0b';
                } else {
                    meter.style.background = '#ef4444';
                }
            }
        });

        // Alert if any metric is below threshold
        const criticalMetrics = Object.entries(performanceMetrics).filter(([key, value]) => value < 80);
        if (criticalMetrics.length > 0) {
            criticalMetrics.forEach(([metric, value]) => {
                this.showNotification(`${metric} performance is at ${value}% - attention required`, 'warning');
            });
        }
    }
}

// Global functions for button interactions
function generateReport() {
    window.govDashboard.generateReport();
}

function viewRegulations() {
    const target = document.querySelector('#regulations');
    if (target) {
        window.govDashboard.scroll.scrollTo(target);
    }
}

function viewUniversities() {
    window.govDashboard.showNotification('Opening detailed university compliance report...', 'info');
}

function viewColleges() {
    window.govDashboard.showNotification('Opening college monitoring dashboard...', 'info');
}

function viewTechnical() {
    window.govDashboard.showNotification('Opening technical institute compliance review...', 'info');
}

function viewFraudDetails() {
    window.govDashboard.showNotification('Opening fraud investigation portal...', 'info');
}

function createPolicy() {
    window.govDashboard.showNotification('Opening policy creation wizard...', 'info');
}

function auditInstitution() {
    window.govDashboard.showNotification('Institution audit scheduling system opened...', 'info');
}

function blacklistCertificate() {
    window.govDashboard.showNotification('Certificate blacklisting interface opened...', 'info');
}

function editPolicy(type) {
    window.govDashboard.showNotification(`Opening ${type} policy editor...`, 'info');
}

function viewPolicy(type) {
    window.govDashboard.showNotification(`Viewing ${type} policy details...`, 'info');
}

function reviewPolicy(type) {
    window.govDashboard.showNotification(`Opening ${type} policy review interface...`, 'info');
}

function playDemo() {
    window.govDashboard.showNotification('Demo feature will be available soon!', 'info');
}

function scheduleDemo() {
    window.govDashboard.showNotification('Demo scheduling feature coming soon!', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored data
        localStorage.removeItem('truecred_user');
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Government Dashboard...');
    window.govDashboard = new GovernmentDashboard();
    
    // Monitor system health periodically
    setInterval(() => {
        window.govDashboard.monitorSystemHealth();
    }, 60000); // Every minute
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    if (window.govDashboard && window.govDashboard.scroll) {
        window.govDashboard.scroll.update();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Dashboard hidden - reducing update frequency');
    } else {
        console.log('Dashboard visible - resuming normal updates');
        ScrollTrigger.refresh();
    }
});

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .notification-panel {
        font-family: 'Inter', sans-serif;
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .panel-header h3 {
        font-size: 1.6rem;
        font-weight: 600;
        color: #1f2937;
    }

    .panel-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
    }

    .panel-content {
        padding: 1rem 0;
        max-height: 35rem;
        overflow-y: auto;
    }

    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 1.2rem;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #f1f5f9;
        transition: background-color 0.2s ease;
    }

    .notification-item:hover {
        background-color: #f8fafc;
    }

    .notification-item.urgent {
        border-left: 3px solid #ef4444;
    }

    .notification-item.info {
        border-left: 3px solid #3b82f6;
    }

    .notification-item.success {
        border-left: 3px solid #10b981;
    }

    .notification-item.warning {
        border-left: 3px solid #f59e0b;
    }

    .notif-icon {
        font-size: 1.8rem;
        margin-top: 0.2rem;
    }

    .notif-content {
        flex: 1;
    }

    .notif-title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.4rem;
    }

    .notif-details {
        font-size: 1.3rem;
        color: #6b7280;
        margin-bottom: 0.4rem;
        line-height: 1.4;
    }

    .notif-time {
        font-size: 1.2rem;
        color: #9ca3af;
    }

    .panel-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-top: 1px solid #e2e8f0;
        background-color: #f8fafc;
    }

    .district-details {
        padding: 1rem 0;
    }

    .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .detail-stat {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
        background: #f8fafc;
        border-radius: 8px;
    }

    .detail-stat .stat-icon {
        font-size: 3rem;
    }

    .detail-stat .stat-number {
        font-size: 2.4rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 0.5rem;
    }

    .detail-stat .stat-label {
        font-size: 1.3rem;
        color: #6b7280;
    }

    .district-actions {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
    }

    .report-generator {
        text-align: center;
        padding: 2rem 0;
    }

    .progress-container {
        margin-bottom: 2rem;
    }

    .progress-bar {
        width: 100%;
        height: 0.8rem;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #1e40af, #3b82f6);
        border-radius: 4px;
        transition: width 0.3s ease;
        width: 0%;
    }

    .progress-percentage {
        font-size: 1.4rem;
        font-weight: 600;
        color: #1e40af;
    }

    .progress-text {
        font-size: 1.5rem;
        color: #6b7280;
        margin-top: 1rem;
    }

    .toast-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.6rem;
        cursor: pointer;
        padding: 0.2rem;
        line-height: 1;
        opacity: 0.8;
    }

    .toast-close:hover {
        opacity: 1;
    }
`;

document.head.appendChild(rippleStyles);
// Additional functions for enhanced compliance cards
function generateUniversityReport() {
    window.govDashboard.showNotification('Generating comprehensive university compliance report...', 'info');
}

function scheduleCollegeAudit() {
    window.govDashboard.showNotification('Scheduling audit for non-compliant colleges...', 'warning');
}

function urgentTechnicalAction() {
    window.govDashboard.showNotification('Initiating urgent compliance action for technical institutes...', 'error');
}

function viewSystemHealth() {
    window.govDashboard.showNotification('Opening detailed system health dashboard...', 'info');
}

function generatePerformanceReport() {
    window.govDashboard.showNotification('Generating system performance analytics report...', 'info');
}

function viewHistoricalData() {
    window.govDashboard.showNotification('Loading historical performance data...', 'info');
}

// Document Analysis Functions
class DocumentAnalyzer {
    constructor() {
        this.uploadedFiles = [];
        this.analysisResults = [];
        this.init();
    }

    init() {
        this.setupUploadZone();
        this.setupEventListeners();
        this.setupProcessingChart();
    }

    setupUploadZone() {
        const uploadZone = document.getElementById('documentUploadZone');
        const fileInput = document.getElementById('fileInput');
        const browseLink = document.querySelector('.browse-link');

        // Drag and drop handlers
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
            this.handleFiles(files);
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
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    setupEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');

        analyzeBtn.addEventListener('click', () => {
            this.analyzeDocuments();
        });

        clearBtn.addEventListener('click', () => {
            this.clearAll();
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateProcessingChart(btn.dataset.period);
            });
        });
    }

    handleFiles(files) {
        const validFiles = files.filter(file => {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
        });

        if (validFiles.length === 0) {
            window.govDashboard.showNotification('Please select valid PDF or image files (max 10MB)', 'error');
            return;
        }

        this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
        this.updateUploadUI();
        
        window.govDashboard.showNotification(`${validFiles.length} file(s) added for analysis`, 'success');
    }

    updateUploadUI() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const uploadZone = document.getElementById('documentUploadZone');

        if (this.uploadedFiles.length > 0) {
            analyzeBtn.disabled = false;
            uploadZone.innerHTML = `
                <div class="upload-zone-content">
                    <div class="files-preview">
                        <div class="files-count">
                            <span class="count-number">${this.uploadedFiles.length}</span>
                            <span class="count-label">file(s) ready for analysis</span>
                        </div>
                        <div class="files-list">
                            ${this.uploadedFiles.map(file => `
                                <div class="file-item">
                                    <div class="file-icon">${this.getFileIcon(file.type)}</div>
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
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

    async analyzeDocuments() {
        if (this.uploadedFiles.length === 0) return;

        const analysisModal = window.govDashboard.createModal('Analyzing Documents', `
            <div class="analysis-progress">
                <div class="analysis-steps">
                    <div class="step-item active" data-step="upload">
                        <div class="step-icon">📤</div>
                        <div class="step-label">Uploading Files</div>
                    </div>
                    <div class="step-item" data-step="ocr">
                        <div class="step-icon">🔤</div>
                        <div class="step-label">OCR Processing</div>
                    </div>
                    <div class="step-item" data-step="ai">
                        <div class="step-icon">🧠</div>
                        <div class="step-label">AI Analysis</div>
                    </div>
                    <div class="step-item" data-step="blockchain">
                        <div class="step-icon">⛓️</div>
                        <div class="step-label">Blockchain Verification</div>
                    </div>
                    <div class="step-item" data-step="complete">
                        <div class="step-icon">✅</div>
                        <div class="step-label">Analysis Complete</div>
                    </div>
                </div>
                <div class="overall-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="analysisProgress"></div>
                    </div>
                    <div class="progress-text" id="progressText">Starting analysis...</div>
                </div>
            </div>
        `);

        const steps = ['upload', 'ocr', 'ai', 'blockchain', 'complete'];
        const stepTexts = [
            'Uploading documents to secure server...',
            'Extracting text using Tesseract OCR...',
            'Running TensorFlow fraud detection...',
            'Verifying against blockchain registry...',
            'Analysis complete! Generating results...'
        ];

        for (let i = 0; i < steps.length; i++) {
            await this.simulateAnalysisStep(steps[i], stepTexts[i], analysisModal);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        window.govDashboard.closeModal(analysisModal);
        this.generateResults();
    }

    async simulateAnalysisStep(step, text, modal) {
        const stepItems = modal.querySelectorAll('.step-item');
        const progressFill = modal.querySelector('#analysisProgress');
        const progressText = modal.querySelector('#progressText');

        // Update step indicators
        stepItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.step === step) {
                item.classList.add('active');
            }
        });

        // Update progress
        const stepIndex = ['upload', 'ocr', 'ai', 'blockchain', 'complete'].indexOf(step);
        const progress = ((stepIndex + 1) / 5) * 100;
        
        gsap.to(progressFill, {
            duration: 1.5,
            width: `${progress}%`,
            ease: 'power2.out'
        });

        progressText.textContent = text;
    }

    generateResults() {
        const resultsSection = document.getElementById('analysisResults');
        const resultsGrid = document.getElementById('resultsGrid');

        // Generate mock results for each file
        this.analysisResults = this.uploadedFiles.map((file, index) => {
            const results = ['verified', 'suspicious', 'fraudulent'];
            const status = results[Math.floor(Math.random() * results.length)];
            
            return {
                filename: file.name,
                status: status,
                confidence: Math.floor(Math.random() * 30) + 70,
                ocrAccuracy: Math.floor(Math.random() * 10) + 90,
                institution: this.getRandomInstitution(),
                issueDate: this.getRandomDate(),
                anomalies: this.getRandomAnomalies(status)
            };
        });

        // Display results
        resultsGrid.innerHTML = this.analysisResults.map(result => `
            <div class="result-card ${result.status}">
                <div class="result-header">
                    <div class="result-title">${result.filename}</div>
                    <div class="result-status ${result.status}">${result.status.toUpperCase()}</div>
                </div>
                <div class="result-details">
                    <div class="result-detail">
                        <span class="detail-label">Confidence:</span>
                        <span class="detail-value">${result.confidence}%</span>
                    </div>
                    <div class="result-detail">
                        <span class="detail-label">OCR Accuracy:</span>
                        <span class="detail-value">${result.ocrAccuracy}%</span>
                    </div>
                    <div class="result-detail">
                        <span class="detail-label">Institution:</span>
                        <span class="detail-value">${result.institution}</span>
                    </div>
                    <div class="result-detail">
                        <span class="detail-label">Issue Date:</span>
                        <span class="detail-value">${result.issueDate}</span>
                    </div>
                    ${result.anomalies.length > 0 ? `
                        <div class="result-detail">
                            <span class="detail-label">Anomalies:</span>
                            <span class="detail-value">${result.anomalies.join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="result-actions">
                    <button class="result-btn" onclick="viewDetailedReport('${result.filename}')">View Report</button>
                    <button class="result-btn" onclick="downloadResult('${result.filename}')">Download</button>
                </div>
            </div>
        `).join('');

        resultsSection.style.display = 'block';
        
        // Animate results appearance
        gsap.from('.result-card', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out'
        });

        window.govDashboard.showNotification('Document analysis completed successfully!', 'success');
    }

    getRandomInstitution() {
        const institutions = [
            'NIT Jamshedpur', 'Ranchi University', 'BIT Mesra', 
            'XLRI Jamshedpur', 'Central University of Jharkhand',
            'Kolhan University', 'Sido Kanhu Murmu University'
        ];
        return institutions[Math.floor(Math.random() * institutions.length)];
    }

    getRandomDate() {
        const start = new Date(2015, 0, 1);
        const end = new Date(2024, 11, 31);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toLocaleDateString('en-GB');
    }

    getRandomAnomalies(status) {
        if (status === 'verified') return [];
        
        const anomalies = [
            'Signature mismatch', 'Watermark inconsistency', 'Font irregularity',
            'Date format error', 'Seal distortion', 'Paper quality deviation'
        ];
        
        const count = status === 'fraudulent' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 1;
        return anomalies.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    clearAll() {
        this.uploadedFiles = [];
        this.analysisResults = [];
        
        const uploadZone = document.getElementById('documentUploadZone');
        const resultsSection = document.getElementById('analysisResults');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        uploadZone.innerHTML = `
            <div class="upload-zone-content">
                <div class="upload-icon-container">
                    <div class="upload-icon">📄</div>
                    <div class="upload-pulse"></div>
                </div>
                <div class="upload-text">
                    <h4>Drop your documents here</h4>
                    <p>or <span class="browse-link">browse files</span> from your computer</p>
                </div>
                <div class="upload-formats">
                    <span class="format-tag">PDF</span>
                    <span class="format-tag">JPG</span>
                    <span class="format-tag">PNG</span>
                    <span class="format-tag">JPEG</span>
                </div>
            </div>
        `;
        
        resultsSection.style.display = 'none';
        analyzeBtn.disabled = true;
        
        window.govDashboard.showNotification('All files cleared', 'info');
    }

    setupProcessingChart() {
        const ctx = document.getElementById('processingChart');
        if (ctx) {
            this.processingChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                    datasets: [{
                        label: 'Documents Processed',
                        data: [45, 32, 89, 156, 203, 167, 98],
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(30, 64, 175, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Fraud Detected',
                        data: [2, 1, 4, 8, 12, 7, 3],
                        borderColor: 'var(--error-color)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' }
                        },
                        x: {
                            grid: { color: '#f1f5f9' }
                        }
                    }
                }
            });
        }
    }

    updateProcessingChart(period) {
        const data = {
            hour: {
                labels: ['00:00', '15:00', '30:00', '45:00'],
                processed: [15, 23, 18, 29],
                fraud: [1, 2, 1, 3]
            },
            day: {
                labels: ['00:00', '06:00', '12:00', '18:00'],
                processed: [45, 89, 156, 98],
                fraud: [2, 4, 8, 3]
            },
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                processed: [234, 345, 298, 412, 389, 234, 198],
                fraud: [12, 18, 15, 22, 19, 11, 8]
            }
        };

        if (this.processingChart && data[period]) {
            this.processingChart.data.labels = data[period].labels;
            this.processingChart.data.datasets[0].data = data[period].processed;
            this.processingChart.data.datasets[1].data = data[period].fraud;
            this.processingChart.update();
        }
    }
}

// Global functions for quick actions
function bulkUpload() {
    window.govDashboard.showNotification('Opening bulk upload interface...', 'info');
}

function compareDocuments() {
    window.govDashboard.showNotification('Opening document comparison tool...', 'info');
}

function batchAnalysis() {
    window.govDashboard.showNotification('Starting batch analysis queue...', 'info');
}

function fraudPatterns() {
    window.govDashboard.showNotification('Loading fraud pattern analysis...', 'info');
}

function institutionLookup() {
    window.govDashboard.showNotification('Opening institution verification database...', 'info');
}

function exportResults() {
    window.govDashboard.showNotification('Exporting analysis results...', 'success');
}

function shareResults() {
    window.govDashboard.showNotification('Preparing results for sharing...', 'info');
}

function viewDetailedReport(filename) {
    window.govDashboard.showNotification(`Opening detailed report for ${filename}...`, 'info');
}

function downloadResult(filename) {
    window.govDashboard.showNotification(`Downloading analysis result for ${filename}...`, 'success');
}

// Initialize document analyzer
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('documentUploadZone')) {
        window.documentAnalyzer = new DocumentAnalyzer();
    }
});
