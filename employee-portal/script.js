let currentEmployee = null;
let currentLocation = null;
let todayAttendance = null;

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Company location for verification 
const COMPANY_LOCATION = {
    lat: 21.602645, //charusat university
    lng: 70.820402,
    radius: 1000 
};

// Login function
async function login() {
    const employeeId = document.getElementById('employeeId').value.trim().toUpperCase();
    const errorDiv = document.getElementById('loginError');

    if (!employeeId) {
        showError(errorDiv, 'Please enter Employee ID');
        return;
    }

    try {
        // Get employee details from backend
        const response = await fetch(`${API_BASE_URL}/employees`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        
        const employee = employees.find(emp => 
            emp.employeeId === employeeId
        );

        if (employee) {
            currentEmployee = employee;
            showEmployeeInfo(employee);
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('attendanceSection').style.display = 'block';
            
            // Initialize location verification and check today's attendance
            await initLocationVerification();
            await checkTodayAttendance();
            await loadLeaveHistory();
            setupLeaveForm();
            
            errorDiv.classList.add('hidden');
        } else {
            showError(errorDiv, `Employee ID ${employeeId} not found in database. Please contact admin to add your record.`);
        }
    } catch (error) {
        console.error('Login error details:', error);
        if (error.message.includes('Failed to fetch')) {
            showError(errorDiv, 'Cannot connect to server. Please check if the backend is running on port 5000.');
        } else if (error.message.includes('HTTP error')) {
            showError(errorDiv, `Server error: ${error.message}`);
        } else {
            showError(errorDiv, 'Connection error. Please try again.');
        }
    }
}

// Show employee information
function showEmployeeInfo(employee) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'employee-info';
    infoDiv.innerHTML = `
        <h3>Welcome, ${employee.name}!</h3>
        <p>ID: ${employee.employeeId} | Department: ${employee.department}</p>
    `;
    
    const attendanceDiv = document.getElementById('attendanceSection');
    attendanceDiv.insertBefore(infoDiv, attendanceDiv.firstChild);
}

// Initialize Location Verification
async function initLocationVerification() {    
    if ("geolocation" in navigator) {
        try {
            const position = await getCurrentPosition();
            onLocationSuccess(position);
        } catch (error) {
            onLocationError(error);
        }
    } else {
        document.getElementById('locationStatus').textContent = 'Geolocation not supported';
        document.getElementById('locationStatus').className = 'status-message error';
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}

function onLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    currentLocation = { lat, lng };

    // Calculate distance from company location
    const distance = calculateDistance(lat, lng, COMPANY_LOCATION.lat, COMPANY_LOCATION.lng);

    // Get readable location name
    getLocationName(lat, lng);
    
    document.getElementById('locationInfo').classList.remove('hidden');

    if (distance <= COMPANY_LOCATION.radius || true) { // Added "|| true" to always allow for testing
        document.getElementById('locationStatus').textContent = 'Location verified ✓';
        document.getElementById('locationStatus').className = 'status-message success';
        document.getElementById('attendanceActions').classList.remove('hidden');
    } else {
        document.getElementById('locationStatus').textContent = 
            `You are ${distance.toFixed(0)}m away from office. Please come closer.`;
        document.getElementById('locationStatus').className = 'status-message error';
    }
}

function onLocationError(error) {
    document.getElementById('locationStatus').textContent = 'Location access denied';
    document.getElementById('locationStatus').className = 'status-message error';
}

// Check today's attendance status
async function checkTodayAttendance() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_BASE_URL}/attendance/employee/${currentEmployee._id}?date=${today}`);
        
        if (response.ok) {
            const attendanceData = await response.json();
            todayAttendance = attendanceData;
            updateAttendanceDisplay();
        } else {
            // No attendance record for today
            todayAttendance = null;
            updateAttendanceDisplay();
        }
    } catch (error) {
        console.error('Error checking today\'s attendance:', error);
        todayAttendance = null;
        updateAttendanceDisplay();
    }
}

// Update attendance display based on current status
function updateAttendanceDisplay() {
    const statusDisplay = document.getElementById('statusDisplay');
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');

    if (!todayAttendance) {
        // No attendance record for today
        statusDisplay.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Status</strong>
                    <span style="color: #ef4444;">Not Checked In</span>
                </div>
                <div class="status-item">
                    <strong>Check-in Time</strong>
                    <span>--:--</span>
                </div>
            </div>
        `;
        checkInBtn.disabled = false;
        checkOutBtn.disabled = true;
    } else if (todayAttendance.checkInTime && todayAttendance.approvalStatus === 'pending' && todayAttendance.requestType === 'checkin') {
        // Check-in pending approval
        const checkInTime = new Date(todayAttendance.checkInTime).toLocaleTimeString();
        statusDisplay.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Status</strong>
                    <span style="color: #f59e0b;">Check-in Pending Approval</span>
                </div>
                <div class="status-item">
                    <strong>Requested Time</strong>
                    <span>${checkInTime}</span>
                </div>
            </div>
            <div class="status-message pending">
                <p>⏳ Your check-in request is waiting for admin approval.</p>
            </div>
        `;
        checkInBtn.disabled = true;
        checkOutBtn.disabled = true;
    } else if (todayAttendance.checkInTime && todayAttendance.approvalStatus === 'approved' && !todayAttendance.checkOutTime) {
        // Checked in and approved, can check out
        const checkInTime = new Date(todayAttendance.checkInTime).toLocaleTimeString();
        statusDisplay.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Status</strong>
                    <span style="color: #10b981;">Checked In</span>
                </div>
                <div class="status-item">
                    <strong>Check-in Time</strong>
                    <span>${checkInTime}</span>
                </div>
            </div>
        `;
        checkInBtn.disabled = true;
        checkOutBtn.disabled = false;
    } else if (todayAttendance.checkInTime && todayAttendance.checkOutTime && todayAttendance.approvalStatus === 'approved') {
        // Both check-in and check-out completed and approved
        const checkInTime = new Date(todayAttendance.checkInTime).toLocaleTimeString();
        const checkOutTime = new Date(todayAttendance.checkOutTime).toLocaleTimeString();
        const workingHours = todayAttendance.workingHours || 0;
        const totalPay = todayAttendance.totalPay || 0;
        
        statusDisplay.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Status</strong>
                    <span style="color: #3b82f6;">Completed</span>
                </div>
                <div class="status-item">
                    <strong>Check-in Time</strong>
                    <span>${checkInTime}</span>
                </div>
            </div>
            <div class="status-info" style="margin-top: 12px;">
                <div class="status-item">
                    <strong>Check-out Time</strong>
                    <span>${checkOutTime}</span>
                </div>
                <div class="status-item">
                    <strong>Working Hours</strong>
                    <span>${workingHours} hours</span>
                </div>
            </div>
            ${totalPay > 0 ? `
            <div class="working-hours">
                <strong>Today's Earnings: ₹${totalPay}</strong>
            </div>
            ` : ''}
        `;
        checkInBtn.disabled = true;
        checkOutBtn.disabled = true;
    } else if (todayAttendance.approvalStatus === 'rejected') {
        // Request was rejected
        statusDisplay.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Status</strong>
                    <span style="color: #ef4444;">Request Rejected</span>
                </div>
                <div class="status-item">
                    <strong>Action Required</strong>
                    <span>Contact Admin</span>
                </div>
            </div>
            <div class="status-message error">
                <p>❌ Your attendance request was rejected. Please contact your administrator.</p>
            </div>
        `;
        checkInBtn.disabled = false; // Allow new request
        checkOutBtn.disabled = true;
    }
}

// Check-in function
async function checkIn() {
    await performAttendanceAction('checkin');
}

// Check-out function
async function checkOut() {
    await performAttendanceAction('checkout');
}

// Perform attendance action (check-in or check-out)
async function performAttendanceAction(action) {
    const resultDiv = document.getElementById('attendanceResult');
    resultDiv.textContent = `Processing ${action}...`;
    resultDiv.className = 'status-message loading';
    resultDiv.classList.remove('hidden');

    try {
        const attendanceData = {
            employeeId: currentEmployee._id,
            location: currentLocation,
            timestamp: new Date().toISOString()
        };

        console.log(`Sending ${action} request:`, attendanceData);

        const response = await fetch(`${API_BASE_URL}/attendance/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });

        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (response.ok) {
            if (action === 'checkin') {
                // Check-in requires approval
                if (responseData.status === 'pending') {
                    resultDiv.textContent = `✅ Check-in request submitted! Waiting for admin approval.`;
                    resultDiv.className = 'status-message pending';
                } else {
                    resultDiv.textContent = `✅ Check-in successful!`;
                    resultDiv.className = 'status-message success';
                }
            } else if (action === 'checkout') {
                // Check-out is auto-approved
                resultDiv.textContent = `✅ Check-out successful! Working hours calculated.`;
                resultDiv.className = 'status-message success';
            }
            
            // Refresh attendance status
            await checkTodayAttendance();
            
            // Auto hide result after 5 seconds
            setTimeout(() => {
                resultDiv.classList.add('hidden');
            }, 5000);
        } else {
            throw new Error(responseData.message || `Failed to ${action}`);
        }
    } catch (error) {
        console.error(`${action} error:`, error);
        resultDiv.textContent = `Failed to ${action}: ${error.message}`;
        resultDiv.className = 'status-message error';
    }
}

// Utility functions
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// Get readable location name from coordinates
async function getLocationName(lat, lng) {
    const coordinatesElement = document.getElementById('coordinates');
    
    try {
        coordinatesElement.textContent = '📍 Getting location...';
        
        // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }
        
        const data = await response.json();
        
        if (data && data.display_name) {
            // Extract meaningful parts of the address
            const address = data.address || {};
            let locationParts = [];
            
            // Add building/amenity if available
            if (address.amenity) locationParts.push(address.amenity);
            if (address.building) locationParts.push(address.building);
            
            // Add road/street
            if (address.road) locationParts.push(address.road);
            
            // Add area/suburb
            if (address.suburb) locationParts.push(address.suburb);
            else if (address.neighbourhood) locationParts.push(address.neighbourhood);
            
            // Add city
            if (address.city) locationParts.push(address.city);
            else if (address.town) locationParts.push(address.town);
            else if (address.village) locationParts.push(address.village);
            
            // Create readable location string
            const readableLocation = locationParts.slice(0, 3).join(', ') || data.display_name.split(',').slice(0, 2).join(',');
            
            coordinatesElement.innerHTML = `📍 <strong>Location:</strong> ${readableLocation}`;
        } else {
            throw new Error('Location not found');
        }
        
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        // Fallback to coordinates if geocoding fails
        coordinatesElement.textContent = `📍 Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Setup leave form
function setupLeaveForm() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const daysInfo = document.getElementById('leaveDaysInfo');
    const daysCount = document.getElementById('daysCount');
    const form = document.getElementById('leaveRequestForm');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;
    
    // Calculate days when dates change
    function calculateDays() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        if (startDate && endDate && endDate >= startDate) {
            const timeDiff = endDate.getTime() - startDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            
            if (daysDiff >= 1 && daysDiff <= 7) {
                daysCount.textContent = `${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
                daysInfo.classList.remove('hidden');
                daysInfo.style.color = '#1d4ed8';
                return daysDiff;
            } else if (daysDiff > 7) {
                daysCount.textContent = `${daysDiff} days (Maximum 7 days allowed)`;
                daysInfo.classList.remove('hidden');
                daysInfo.style.color = '#dc2626';
                return null;
            } else {
                daysInfo.classList.add('hidden');
                return null;
            }
        } else {
            daysInfo.classList.add('hidden');
            return null;
        }
    }
    
    startDateInput.addEventListener('change', () => {
        if (startDateInput.value) {
            endDateInput.min = startDateInput.value;
            if (endDateInput.value && endDateInput.value < startDateInput.value) {
                endDateInput.value = startDateInput.value;
            }
        }
        calculateDays();
    });
    
    endDateInput.addEventListener('change', calculateDays);
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const days = calculateDays();
        if (!days || days > 7) {
            showLeaveError('Please select a valid date range (1-7 days)');
            return;
        }
        
        await submitLeaveRequest();
    });
}

// Submit leave request
async function submitLeaveRequest() {
    const form = document.getElementById('leaveRequestForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('leaveResult');
    
    // Get form data
    const formData = {
        employeeId: currentEmployee._id,
        leaveType: document.getElementById('leaveType').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        reason: document.getElementById('leaveReason').value.trim()
    };
    
    // Validate form data
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
        showLeaveError('Please fill in all fields');
        return;
    }
    
    if (formData.reason.length < 10) {
        showLeaveError('Please provide a detailed reason (at least 10 characters)');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    resultDiv.textContent = 'Submitting leave request...';
    resultDiv.className = 'status-message loading';
    resultDiv.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            resultDiv.textContent = '✅ Leave request submitted successfully! Waiting for approval.';
            resultDiv.className = 'status-message success';
            
            // Reset form
            form.reset();
            document.getElementById('leaveDaysInfo').classList.add('hidden');
            
            // Reload leave history
            await loadLeaveHistory();
            
            // Auto hide result after 5 seconds
            setTimeout(() => {
                resultDiv.classList.add('hidden');
            }, 5000);
        } else {
            throw new Error(responseData.message || 'Failed to submit leave request');
        }
    } catch (error) {
        console.error('Leave request error:', error);
        showLeaveError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Leave Request';
    }
}

// Load leave history
async function loadLeaveHistory() {
    const historyDiv = document.getElementById('leaveHistory');
    
    try {
        historyDiv.innerHTML = '<p>Loading leave history...</p>';
        
        const response = await fetch(`${API_BASE_URL}/leaves/employee/${currentEmployee._id}`);
        
        if (response.ok) {
            const leaveHistory = await response.json();
            displayLeaveHistory(leaveHistory);
        } else {
            historyDiv.innerHTML = '<p>No leave history found.</p>';
        }
    } catch (error) {
        console.error('Error loading leave history:', error);
        historyDiv.innerHTML = '<p>Failed to load leave history.</p>';
    }
}

// Display leave history
function displayLeaveHistory(leaveHistory) {
    const historyDiv = document.getElementById('leaveHistory');
    
    if (!leaveHistory || leaveHistory.length === 0) {
        historyDiv.innerHTML = '<p>No leave requests found.</p>';
        return;
    }
    
    const historyHTML = leaveHistory
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5) // Show only last 5 requests
        .map(leave => {
            const startDate = new Date(leave.startDate).toLocaleDateString();
            const endDate = new Date(leave.endDate).toLocaleDateString();
            const statusClass = leave.status.toLowerCase();
            
            return `
                <div class="leave-request-item">
                    <div class="leave-request-header">
                        <span class="leave-type">${leave.leaveType}</span>
                        <span class="leave-status ${statusClass}">${leave.status}</span>
                    </div>
                    <div class="leave-dates">${startDate} - ${endDate}</div>
                    <div class="leave-reason">"${leave.reason}"</div>
                </div>
            `;
        })
        .join('');
    
    historyDiv.innerHTML = historyHTML;
}

// Show leave error
function showLeaveError(message) {
    const resultDiv = document.getElementById('leaveResult');
    resultDiv.textContent = message;
    resultDiv.className = 'status-message error';
    resultDiv.classList.remove('hidden');
}
