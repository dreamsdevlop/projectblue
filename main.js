// Main JavaScript for Shahid Mehmood Property Adviser & Consultant Platform

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeCarousels();
    initializeCounters();
    initializeCalculators();
    initializePropertySearch();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation initialization
function initializeAnimations() {
    // Typewriter effect for hero text
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        new Typed('#typed-text', {
            strings: [
                'Pakistan\'s Trusted Property Legal Hub',
                'Secure Property Transactions',
                'Expert Legal Verification',
                'Transparent Property Deals'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card-hover, .calculator-widget').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize carousels
function initializeCarousels() {
    // Property carousel
    const propertyCarousel = document.getElementById('property-carousel');
    if (propertyCarousel) {
        new Splide('#property-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                1024: {
                    perPage: 2,
                },
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    }
    
    // Testimonial carousel
    const testimonialCarousel = document.getElementById('testimonial-carousel');
    if (testimonialCarousel) {
        new Splide('#testimonial-carousel', {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: false,
            pagination: true
        }).mount();
    }
}

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

// Calculator functionality
function initializeCalculators() {
    // Add event listeners for calculator inputs
    const calculatorInputs = document.querySelectorAll('input[id$="-result"]');
    calculatorInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
}

// Mortgage Calculator
function calculateMortgage() {
    const propertyPrice = parseFloat(document.getElementById('property-price').value);
    const downPaymentPercent = parseFloat(document.getElementById('down-payment').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;
    const loanTerm = parseFloat(document.getElementById('loan-term').value) * 12;
    
    if (!propertyPrice || !downPaymentPercent || !interestRate || !loanTerm) {
        document.getElementById('mortgage-result').innerHTML = '<span class="text-alert">Please fill all fields</span>';
        return;
    }
    
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    
    const monthlyPayment = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('mortgage-result').innerHTML = `
        <div class="text-sm space-y-1">
            <div>Monthly Payment: <strong>PKR ${monthlyPayment.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Total Interest: <strong>PKR ${totalInterest.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Total Payment: <strong>PKR ${totalPayment.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
        </div>
    `;
}

// Stamp Duty Calculator
function calculateStampDuty() {
    const province = document.getElementById('province-select').value;
    const propertyValue = parseFloat(document.getElementById('property-value').value);
    
    if (!province || !propertyValue) {
        document.getElementById('stamp-duty-result').innerHTML = '<span class="text-alert">Please fill all fields</span>';
        return;
    }
    
    // Stamp duty rates by province (approximate values)
    const stampDutyRates = {
        'punjab': 0.03,
        'sindh': 0.025,
        'kpk': 0.02,
        'balochistan': 0.015
    };
    
    const rate = stampDutyRates[province];
    const stampDuty = propertyValue * rate;
    const registrationFee = propertyValue * 0.01; // 1% registration fee
    const totalCost = stampDuty + registrationFee;
    
    document.getElementById('stamp-duty-result').innerHTML = `
        <div class="text-sm space-y-1">
            <div>Stamp Duty: <strong>PKR ${stampDuty.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Registration Fee: <strong>PKR ${registrationFee.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Total Cost: <strong>PKR ${totalCost.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
        </div>
    `;
}

// Property Tax Calculator
function calculatePropertyTax() {
    const province = document.getElementById('tax-province').value;
    const annualValue = parseFloat(document.getElementById('annual-value').value);
    
    if (!province || !annualValue) {
        document.getElementById('property-tax-result').innerHTML = '<span class="text-alert">Please fill all fields</span>';
        return;
    }
    
    // Property tax rates by province (approximate values)
    const taxRates = {
        'punjab': 0.05,
        'sindh': 0.04,
        'kpk': 0.03,
        'balochistan': 0.025
    };
    
    const rate = taxRates[province];
    const annualTax = annualValue * rate;
    
    document.getElementById('property-tax-result').innerHTML = `
        <div class="text-sm space-y-1">
            <div>Annual Tax: <strong>PKR ${annualTax.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Monthly Tax: <strong>PKR ${(annualTax / 12).toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Tax Rate: <strong>${(rate * 100).toFixed(1)}%</strong></div>
        </div>
    `;
}

// ROI Calculator
function calculateROI() {
    const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
    const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
    const annualExpenses = parseFloat(document.getElementById('annual-expenses').value);
    
    if (!investmentAmount || !monthlyRent) {
        document.getElementById('roi-result').innerHTML = '<span class="text-alert">Please fill required fields</span>';
        return;
    }
    
    const annualRent = monthlyRent * 12;
    const netAnnualIncome = annualRent - (annualExpenses || 0);
    const roiPercentage = (netAnnualIncome / investmentAmount) * 100;
    
    document.getElementById('roi-result').innerHTML = `
        <div class="text-sm space-y-1">
            <div>Annual Rent: <strong>PKR ${annualRent.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>Net Annual Income: <strong>PKR ${netAnnualIncome.toLocaleString('en-PK', {maximumFractionDigits: 0})}</strong></div>
            <div>ROI: <strong>${roiPercentage.toFixed(2)}%</strong></div>
        </div>
    `;
}

// Property search functionality
function initializePropertySearch() {
    // Add event listeners for search filters
    const searchInputs = document.querySelectorAll('#location-select, #property-type, #price-range, #verification-status');
    searchInputs.forEach(input => {
        input.addEventListener('change', function() {
            // In a real application, this would trigger an API call
            console.log('Search filters updated:', {
                location: document.getElementById('location-select').value,
                propertyType: document.getElementById('property-type').value,
                priceRange: document.getElementById('price-range').value,
                verificationStatus: document.getElementById('verification-status').value
            });
        });
    });
}

function searchProperties() {
    const location = document.getElementById('location-select').value;
    const propertyType = document.getElementById('property-type').value;
    const priceRange = document.getElementById('price-range').value;
    const verificationStatus = document.getElementById('verification-status').value;
    
    if (!location && !propertyType && !priceRange && !verificationStatus) {
        alert('Please select at least one search criteria');
        return;
    }
    
    // In a real application, this would make an API call
    // For demo purposes, we'll show a success message
    const searchCriteria = [];
    if (location) searchCriteria.push(`Location: ${location}`);
    if (propertyType) searchCriteria.push(`Type: ${propertyType}`);
    if (priceRange) searchCriteria.push(`Price: ${priceRange}`);
    if (verificationStatus) searchCriteria.push(`Status: ${verificationStatus}`);
    
    alert(`Searching properties with criteria:\n${searchCriteria.join('\n')}\n\nFound 12 matching properties. Redirecting to results page...`);
    
    // Simulate redirect to verification page
    setTimeout(() => {
        window.location.href = 'verification.html';
    }, 2000);
}

function quickVerify() {
    const input = document.querySelector('input[placeholder="Enter Property ID or CNIC"]');
    const value = input.value.trim();
    
    if (!value) {
        alert('Please enter a Property ID or CNIC number');
        return;
    }
    
    // Simulate verification process
    const resultsDiv = document.getElementById('verification-results');
    resultsDiv.innerHTML = '<div class="animate-pulse">Verifying...</div>';
    
    setTimeout(() => {
        const mockResults = [
            {
                status: 'verified',
                message: '<div class="text-success font-semibold">✓ Property Verified</div><div class="text-xs mt-1">All documents are valid and up to date</div>'
            },
            {
                status: 'pending',
                message: '<div class="text-alert font-semibold">⏳ Verification Pending</div><div class="text-xs mt-1">Some documents are under review</div>'
            },
            {
                status: 'needs-attention',
                message: '<div class="text-red-600 font-semibold">⚠ Attention Required</div><div class="text-xs mt-1">Missing documents detected</div>'
            }
        ];
        
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        resultsDiv.innerHTML = randomResult.message;
    }, 2000);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
}

function validateCNIC(cnic) {
    const re = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    return re.test(cnic);
}

// Animation helpers
function animateElement(element, animation) {
    anime({
        targets: element,
        ...animation
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-success text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-alert text-white' :
        'bg-navy text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.searchProperties = searchProperties;
window.quickVerify = quickVerify;
window.calculateMortgage = calculateMortgage;
window.calculateStampDuty = calculateStampDuty;
window.calculatePropertyTax = calculatePropertyTax;
window.calculateROI = calculateROI;

// Enhanced notification system for chatbot integration
function showChatbotNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-success text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-alert text-white' :
        'bg-navy text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }
        });
    }, 4000);
}

// Integration with chatbot for property search
function searchPropertiesWithAI() {
    const location = document.getElementById('location-select').value;
    const propertyType = document.getElementById('property-type').value;
    const priceRange = document.getElementById('price-range').value;
    const verificationStatus = document.getElementById('verification-status').value;
    
    if (!location && !propertyType && !priceRange && !verificationStatus) {
        // Trigger chatbot if no criteria selected
        if (window.geminiChatbot && !window.geminiChatbot.isOpen) {
            window.geminiChatbot.toggleChatbot();
            setTimeout(() => {
                window.geminiChatbot.addMessage('I can help you search for properties! What type of property are you looking for and in which city?', 'bot');
            }, 500);
        }
        return;
    }
    
    searchProperties();
}

// Enhanced quick verify with AI assistance
function quickVerifyWithAI() {
    const input = document.querySelector('input[placeholder="Enter Property ID or CNIC"]');
    const value = input.value.trim();
    
    if (!value) {
        if (window.geminiChatbot && !window.geminiChatbot.isOpen) {
            window.geminiChatbot.toggleChatbot();
            setTimeout(() => {
                window.geminiChatbot.addMessage('I can help you verify a property! Please provide the Property ID, CNIC, or any other property details you have.', 'bot');
            }, 500);
        }
        return;
    }
    
    quickVerify();
}

// Update search button to use AI integration
document.addEventListener('DOMContentLoaded', function() {
    // Update search button onclick
    const searchBtn = document.querySelector('button[onclick="searchProperties()"]');
    if (searchBtn) {
        searchBtn.setAttribute('onclick', 'searchPropertiesWithAI()');
    }
    
    // Update quick verify button onclick
    const verifyBtn = document.querySelector('button[onclick="quickVerify()"]');
    if (verifyBtn) {
        verifyBtn.setAttribute('onclick', 'quickVerifyWithAI()');
    }
    
    // Add chatbot trigger for calculators
    const calculatorButtons = document.querySelectorAll('button[onclick^="calculate"]');
    calculatorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                if (window.geminiChatbot) {
                    showChatbotNotification('Need help understanding the results? Ask our AI assistant!', 'info');
                }
            }, 2000);
        });
    });
});

// Export new functions
window.searchPropertiesWithAI = searchPropertiesWithAI;
window.quickVerifyWithAI = quickVerifyWithAI;
window.showChatbotNotification = showChatbotNotification;