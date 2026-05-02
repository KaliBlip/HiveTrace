# HiveTrace User Flows & Workflows

Complete guide to user journeys through the HiveTrace platform.

---

## 👨‍🌾 Producer Flow

### 1. Registration & Onboarding
```
Landing Page
    ↓
Click "Get Started" or "I'm a Producer"
    ↓
/auth/register?role=producer
    ↓
Fill Form:
  - Full Name
  - Business/Apiary Name
  - Email
  - Password
    ↓
Create Account
    ↓
Redirected to /dashboard
```

### 2. Creating First Honey Batch
```
/dashboard
    ↓
Click "Create Batch" button
    ↓
/dashboard/batches/new
    ↓
Fill Form:
  - Batch Name: "Wildflower Blend 2024"
  - Harvest Date: 2024-05-15
  - Quantity: 50 kg
  - Honey Type: Wildflower
  - Location: [Optional]
    ↓
Click "Create Batch"
    ↓
System:
  1. Generates unique code: HT-2024-WFB-001
  2. Creates HMAC-SHA256 hash
  3. Encodes QR code data
  4. Stores batch data
    ↓
Success! Redirected to batch details
```

### 3. Managing Batches
```
/dashboard/batches
    ↓
View All Batches Table:
  - Batch Name
  - Harvest Date
  - Quantity
  - QR Scans Count
  - Status (Verified)
    ↓
Click on batch to:
  - View full details
  - Copy QR code
  - Check scan statistics
  - View consumer reviews
  - Export data
```

### 4. Monitoring Performance
```
/dashboard/analytics
    ↓
View Metrics:
  - Total Batches Created
  - Total Quantity Produced
  - Average Rating (from reviews)
  - Total Consumer Scans
  - Popular Batch Types
    ↓
View Charts & Graphs:
  - Scan trends over time
  - Rating distribution
  - Batch type breakdown
```

### 5. Managing Reviews
```
/dashboard/reviews
    ↓
View All Reviews:
  - Batch Name
  - Consumer Rating (1-5 stars)
  - Review Text
  - Date Posted
  - Verified Purchase Badge
    ↓
Can:
  - Read full review
  - Respond to review
  - Report inappropriate content
    ↓
Producer Rating Updated:
  - Average of all reviews
  - Display on consumer pages
```

### 6. Account Settings
```
/dashboard/settings
    ↓
Edit Profile:
  - Business Name
  - Location/Address
  - Contact Email
  - Phone Number
    ↓
Manage Certifications:
  - Upload certificates
  - View verification status
    ↓
Change Password:
  - Old Password
  - New Password
  - Confirm Password
    ↓
Save Changes
```

---

## 👥 Consumer Flow

### 1. Landing & Discovery
```
Home Page (/)
    ↓
Learn About HiveTrace:
  - Read features
  - See how it works
  - View security details
    ↓
Either:
  A) Click "For Consumers"
     ↓ /consumer
  B) Click "Get Started"
     ↓ /auth/register?role=consumer
```

### 2. Account Creation (Optional)
```
/auth/register?role=consumer
    ↓
Fill Form:
  - Full Name
  - Email
  - Password
    ↓
Create Account
    ↓
Access /consumer dashboard
```

### 3. Scanning Honey QR Code

#### Option A: Browser Camera
```
/consumer/scanner
    ↓
Click "Enable Camera"
    ↓
Browser requests camera permission
    ↓
Point camera at QR code on honey jar
    ↓
System scans & recognizes QR:
  - Extracts Batch ID
  - Retrieves Verification Hash
    ↓
Automatically verifies:
  1. Hash matches current batch data
  2. No tampering detected
  3. Batch is legitimate
    ↓
Shows Verification Badge ✓
```

#### Option B: Manual Entry
```
/consumer/scanner
    ↓
Enter in "Manual Entry":
  - Paste QR code text
  OR
  - Type batch ID (e.g., HT-2024-WFB-001)
    ↓
Click "Verify Batch"
    ↓
System verifies integrity
    ↓
Display Results
```

#### Option C: Image Upload
```
/consumer/scanner
    ↓
Upload photo of QR code
    ↓
System extracts QR code data
    ↓
Verify & display results
```

### 4. Viewing Batch Details
```
Verification Successful
    ↓
Display Batch Information:
  - Batch ID: HT-2024-WFB-001
  - Honey Type: Wildflower
  - Harvest Date: May 15, 2024
  - Quantity: 50 kg
  - Producer: Golden Valley Apiaries
  - Verification Status: ✓ Authentic
    ↓
Click "View Producer Profile"
    ↓ /consumer/producer/[id]
```

### 5. Producer Profile
```
/consumer/producer/1
    ↓
View Producer Info:
  - Business Name
  - Location
  - About
  - Verification Badge (if verified)
    ↓
See Reputation:
  - Overall Rating: 4.8/5 stars
  - Total Reviews: 128
  - Review Breakdown (5/4/3/2/1 stars)
    ↓
View Producer History:
  - List of all batches
  - Average quality rating
  - Certifications (if any)
```

### 6. Leaving a Review
```
/consumer/batch/1
    ↓
Scroll to Reviews Section
    ↓
If Verified Purchase:
  - Can leave review
  - Can rate 1-5 stars
    ↓
If Not Verified Purchase:
  - Can read reviews
  - Cannot submit review
    ↓
Fill Review Form:
  - Select Star Rating (1-5)
  - Write Review Comment (optional)
  - Check "Verified Purchase" (auto-checked if eligible)
    ↓
Click "Submit Review"
    ↓
Review Posted:
  - Displayed on batch page
  - Attributed to consumer
  - Updates producer rating
```

### 7. Exploring More Batches
```
/consumer
    ↓
Browse Available Batches:
  - Search by batch code
  - Filter by producer
  - Sort by rating
    ↓
Click on batch card
    ↓
View Details & Reviews
    ↓
Scan QR Code to Verify
```

---

## 🛡️ Admin Flow

### 1. Login to Admin Panel
```
/auth/login
    ↓
Enter Admin Credentials:
  - Email: admin@hivetrace.com
  - Password: [admin password]
    ↓
Login
    ↓
Redirected to /admin
```

### 2. Dashboard Overview
```
/admin
    ↓
View Key Metrics:
  - Total Batches: 1,247
  - Active Producers: 156
  - Fraud Alerts: 8
  - Reviews This Week: 342
    ↓
Quick Stats:
  - Verified vs Suspicious Batches
  - Producer Approval Queue
  - High-Severity Alerts
```

### 3. Monitoring Fraud Alerts
```
/admin/fraud
    ↓
View All Fraud Alerts:
  - Alert Type (Duplicate QR, Geo-Mismatch, Suspicious Activity)
  - Batch Name
  - Severity (Low/Medium/High)
  - Description
  - Status (Active/Resolved)
    ↓
Click Alert to Investigate:
  - View full details
  - See batch history
  - Check producer info
  - View scan locations/times
    ↓
Take Action:
  - Mark as Resolved
  - Block Producer
  - Request Investigation
  - Notify Producer
```

### 4. Managing Producers
```
/admin/producers
    ↓
View All Producers:
  - Name
  - Approval Status (Pending/Approved/Rejected)
  - Total Batches
  - Average Rating
  - Registration Date
    ↓
Click Producer to:
  - View Full Profile
  - Check Certifications
  - Review Fraud History
  - View All Batches
    ↓
Approval Actions:
  - ✓ Approve Producer
  - ✗ Reject Producer
  - 🚫 Suspend Account
  - 📧 Send Message
    ↓
Producer Status Updated:
  - Notification sent to producer
  - Access updated
  - Batches visibility affected
```

### 5. Batch Audit
```
/admin/batches
    ↓
View All Batches:
  - Batch Code
  - Producer
  - Harvest Date
  - Scan Count
  - Status (Verified/Suspicious)
    ↓
Click Batch to:
  - View Complete Details
  - Check Integrity Hash
  - See Scan History
  - View All Reviews
  - Check for Fraud Alerts
    ↓
If Suspicious:
  - Flag for Review
  - Open Investigation
  - Request Producer Response
```

### 6. Generating Reports
```
/admin/reports
    ↓
Select Report Type:
  - Fraud Summary Report
  - Producer Performance Report
  - Batch Quality Report
  - Consumer Activity Report
  - Revenue Report (if applicable)
    ↓
Set Parameters:
  - Date Range
  - Filter by Producer
  - Filter by Region
    ↓
Generate Report
    ↓
View & Export:
  - PDF Download
  - CSV Export
  - Print
```

---

## 🔄 Verification Flow (Detailed)

### What Happens During Verification

```
Consumer Scans QR Code
    ↓
1. Extract Data:
   {
     "batchId": "HT-2024-WFB-001",
     "hash": "7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f",
     "timestamp": "2024-05-15T10:30:00Z"
   }
    ↓
2. Lookup Batch:
   Query database for batch matching HT-2024-WFB-001
    ↓
3. Recalculate Hash:
   HMAC-SHA256({
     batchId: "HT-2024-WFB-001",
     harvestDate: "2024-05-15",
     quantity: 50,
     producerId: "producer-1"
   })
    ↓
4. Compare Hashes:
   Scanned Hash: 7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f
   Calculated Hash: 7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f
   
   ✓ MATCH = Verified & Authentic
   ✗ NO MATCH = Tampered/Fraudulent
    ↓
5. Run Fraud Checks:
   ✓ No duplicate QR codes
   ✓ Producer is verified
   ✓ Scan location is reasonable
   ✓ No suspicious patterns
    ↓
6. Record Scan:
   - Log timestamp
   - Log location (if available)
   - Increment scan count
   - Check for anomalies
    ↓
7. Display Results:
   VERIFIED ✓
   OR
   SUSPICIOUS ⚠️
   OR
   FRAUDULENT ✗
```

---

## 📊 Data Flow Diagram

```
Producer Creates Batch
         ↓
    ┌────┴────┐
    ↓         ↓
Generate   Create
Unique ID  Hash
(HT-2024-) (SHA256)
    ↓         ↓
    └────┬────┘
         ↓
    Generate QR Code
    (Contains ID + Hash)
         ↓
    Print on Honey Jar
         ↓
    Consumer Finds Jar
    (At Store/Home)
         ↓
    Scans QR Code
         ↓
    ┌────┴────┬────────┐
    ↓         ↓        ↓
 Extract  Lookup   Verify
   Data   Batch    Hash
    ↓         ↓        ↓
    └─────┬────────────┘
          ↓
    ┌─────┴──────────────┐
    ↓                    ↓
 VERIFIED ✓          FRAUDULENT ✗
    ↓                    ↓
Display Batch        Alert Admin
Info & Reviews       Block Producer
    ↓                    ↓
Allow Review         Investigation
Submission           Started
```

---

## 🔐 Fraud Detection Workflows

### Scenario 1: Duplicate QR Code
```
Same QR Code Scanned Multiple Times
    ↓
First 5 Scans: ✓ Normal
    ↓
Scan #6-10 in 1 hour: ⚠️ Suspicious Pattern
    ↓
Scan #50 in same hour: 🚫 Fraudulent
    ↓
ALERT GENERATED:
  Type: duplicate_qr
  Severity: HIGH
  Description: "50 scans from different locations in 1 hour"
    ↓
Admin Notified
    ↓
Producer Account Reviewed
    ↓
Action: ✓ Resolve or 🚫 Ban
```

### Scenario 2: Geo-Mismatch
```
Producer Location: New York, NY
    ↓
Consumer Scan Location: Los Angeles, CA
    ↓
Distance: 2,500 miles (>50km threshold)
    ↓
⚠️ GEO-MISMATCH ALERT
  Description: "Scan from suspicious location"
  Severity: MEDIUM
    ↓
Possible Explanations:
  1. Honey shipped to retailer
  2. Consumer traveling
  3. Fraudulent QR replication
    ↓
Admin Reviews Context:
  - Producer shipping history
  - Batch distribution
  - Scan patterns
    ↓
Action: Approve ✓ or Investigate 🔍
```

### Scenario 3: Suspicious Activity
```
Normal Batch Scan Pattern: 2-5 scans per day
    ↓
Unusual Pattern Detected:
  - 100 scans in 30 minutes
  - All from same IP address
  - Robotically timed intervals
    ↓
🚫 SUSPICIOUS ACTIVITY ALERT
  Severity: HIGH
  Possible: Automated fraud test
    ↓
Admin Actions:
  - Contact Producer
  - Review batch status
  - Check for cloning
  - Monitor closely
```

---

## 🎯 Key Interaction Points

### Producer → System
- ✍️ Create/Edit Batch
- 📊 View Analytics
- 💬 Read Reviews
- ⚙️ Update Settings

### Consumer → System
- 📱 Scan QR Code
- 📖 View Batch Details
- ⭐ Submit Review
- 🔍 Search Batches

### Admin → System
- 🔔 Monitor Alerts
- ✅ Approve Producers
- 📋 Audit Batches
- 📊 Generate Reports

### System → Producer
- 📧 Alert (Fraud Detected)
- 📬 New Review Notification
- 📈 Analytics Dashboard
- ✓ Batch Approved

### System → Consumer
- ✓ Verification Result
- 🔍 Batch Details
- ⭐ Review Receipt
- 💬 Review Response

### System → Admin
- 🚨 Fraud Alert
- ⏰ Activity Report
- 📊 Performance Metrics
- 🔔 Producer Approval Queue

---

This document provides a complete view of all user journeys through HiveTrace!
