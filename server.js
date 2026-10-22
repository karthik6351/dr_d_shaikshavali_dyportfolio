require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DIRECT_URI = process.env.MONGODB_DIRECT_URI;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local JSON cache file for resilience
const localDataFile = path.join(__dirname, 'portfolio-data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets and uploaded files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(__dirname));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (allowedExtensions.test(ext) || allowedExtensions.test(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png, webp, svg, gif) and PDF documents are allowed!'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// ==========================================
// SCHEMAS & MODELS
// ==========================================

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    updatedAt: { type: Date, default: Date.now }
});

const PortfolioSchema = new mongoose.Schema({
    hero: {
        name: { type: String, default: 'Dr. Dudekula Shaikshavali' },
        badge: { type: String, default: 'Assistant Professor — VLSI Domain' },
        subtitle: { type: String, default: 'Assistant Professor & VLSI Researcher' },
        typedPhrases: {
            type: [String],
            default: [
                'an Assistant Professor',
                'a VLSI Expert',
                'a Semiconductor Device Physicist',
                'a Microwave Engineering Researcher',
                'a Ph.D. in VLSI Domain'
            ]
        },
        stats: {
            publications: { type: Number, default: 7 },
            patents: { type: Number, default: 4 },
            experience: { type: Number, default: 10 },
            citations: { type: Number, default: 50 }
        },
        resumeUrl: { type: String, default: 'Shaik_July2026_CV-6.pdf' }
    },
    about: {
        image: { type: String, default: 'profile.jpg' },
        role: { type: String, default: 'Assistant Professor' },
        institution: { type: String, default: 'QIS College of Engineering & Technology, Ongole' },
        badge: { type: String, default: 'Ph.D. — VLSI' },
        bio: {
            type: String,
            default: 'Motivated academician with a Ph.D. in VLSI domain and experience in teaching, research, and advanced semiconductor device designs. I am dedicated to leveraging my expertise in semiconductor physics, VLSI, and microwave engineering to deliver quality education, mentor students, and contribute to cutting-edge research and academic growth.'
        },
        details: {
            phd: { type: String, default: 'VLSI — VIT, Vellore (2023)' },
            mtech: { type: String, default: 'Embedded Systems — SRM University (2014)' },
            email: { type: String, default: 'dudekulashaiksha91@gmail.com' },
            phone: { type: String, default: '+91 9884997816' },
            dob: { type: String, default: '30/06/1992 | Indian' },
            languages: { type: String, default: 'Telugu, English, Hindi, Tamil' }
        },
        competencies: {
            type: [String],
            default: [
                'VLSI Design',
                'Semiconductor Device Physics',
                'Microwave Engineering',
                'TCAD (Silvaco & Sentaurus)',
                'AWR Microwave Office',
                'Cadence',
                'MATLAB',
                'Xilinx ISE'
            ]
        }
    },
    education: [{
        degree: String,
        institution: String,
        period: String,
        thesis: String,
        fields: String,
        grade: String
    }],
    experience: [{
        role: String,
        organization: String,
        period: String,
        isCurrent: { type: Boolean, default: false },
        highlights: [String]
    }],
    publications: [{
        title: String,
        journal: String,
        year: String,
        indexing: String,
        link: String,
        status: { type: String, default: 'PUBLISHED' }
    }],
    conferences: [{
        title: String,
        event: String,
        location: String,
        dates: String,
        status: { type: String, default: 'PRESENTED' }
    }],
    bookChapters: [{
        title: String,
        details: String,
        date: String,
        status: { type: String, default: 'PUBLISHED' }
    }],
    patents: [{
        title: String,
        country: String,
        status: { type: String, default: 'FILED' },
        date: String
    }],
    fundedProjects: [{
        title: String,
        agency: String,
        amount: String,
        period: String,
        description: String,
        status: { type: String, default: 'ONGOING' }
    }],
    activities: {
        organisational: [String],
        memberships: [String],
        workshops: [{
            title: String,
            institution: String,
            dates: String
        }],
        certifications: [String],
        references: [{
            name: String,
            title: String,
            institution: String,
            phone: String
        }]
    },
    contact: {
        location: { type: String, default: 'Bhagyanagar 2nd line, 523001, Ongole, India' },
        email: { type: String, default: 'dudekulashaiksha91@gmail.com' },
        phone: { type: String, default: '+91 9884997816' },
        linkedin: { type: String, default: 'https://linkedin.com/in/shaik-sha-20b8781b5' },
        scholar: { type: String, default: 'https://scholar.google.com/citations?user=hOaphsYAAAAJ&hl=en' }
    },
    gallery: [{
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    updatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);
const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const defaultPortfolioData = {
    hero: {
        name: 'Dr. Dudekula Shaikshavali',
        badge: 'Assistant Professor — VLSI Domain',
        subtitle: 'Assistant Professor & VLSI Researcher',
        typedPhrases: [
            'an Assistant Professor',
            'a VLSI Expert',
            'a Semiconductor Device Physicist',
            'a Microwave Engineering Researcher',
            'a Ph.D. in VLSI Domain'
        ],
        stats: {
            publications: 7,
            patents: 4,
            experience: 10,
            citations: 50
        },
        resumeUrl: 'Shaik_July2026_CV-6.pdf'
    },
    about: {
        image: 'profile.jpg',
        role: 'Assistant Professor',
        institution: 'QIS College of Engineering & Technology, Ongole',
        badge: 'Ph.D. — VLSI',
        bio: 'Motivated academician with a Ph.D. in VLSI domain and experience in teaching, research, and advanced semiconductor device designs. I am dedicated to leveraging my expertise in semiconductor physics, VLSI, and microwave engineering to deliver quality education, mentor students, and contribute to cutting-edge research and academic growth.',
        details: {
            phd: 'VLSI — VIT, Vellore (2023)',
            mtech: 'Embedded Systems — SRM University (2014)',
            email: 'dudekulashaiksha91@gmail.com',
            phone: '+91 9884997816',
            dob: '30/06/1992 | Indian',
            languages: 'Telugu, English, Hindi, Tamil'
        },
        competencies: [
            'VLSI Design',
            'Semiconductor Device Physics',
            'Microwave Engineering',
            'TCAD (Silvaco & Sentaurus)',
            'AWR Microwave Office',
            'Cadence',
            'MATLAB',
            'Xilinx ISE'
        ]
    },
    education: [
        {
            degree: 'Ph.D in VLSI',
            institution: 'Vellore Institute of Technology, Vellore',
            period: '2016 – 2023',
            thesis: 'HIGH PERFORMANCE SCHOTTKY BARRIER DIODES FOR MICROWAVE DETECTION',
            fields: 'VLSI, TCAD Silvaco, Semiconductor Device Physics',
            grade: ''
        },
        {
            degree: 'M.Tech in Embedded System Technology',
            institution: 'SRM University, Chennai',
            period: '2013 – 2014',
            thesis: 'BATTERY CHARGING OPTIMIZATION SOLAR POWERED ROBOT',
            fields: 'Embedded Systems, Microcontrollers',
            grade: '84.6%'
        },
        {
            degree: 'B.Tech in Electronics & Communication',
            institution: 'G.PullaReddy Engineering College, Kurnool',
            period: '2009 – 2013',
            thesis: 'IMAGE RETRIEVAL USING BOTH COLOR AND TEXTURE',
            fields: 'Electronics and Communication',
            grade: '60.5%'
        }
    ],
    experience: [
        {
            role: 'Assistant Professor',
            organization: 'QIS College of Engineering and Technology, Ongole',
            period: 'Nov 2024 - Present',
            isCurrent: true,
            highlights: ['Teaching core VLSI and semiconductor courses', 'Guiding student projects and research initiatives']
        },
        {
            role: 'Assistant Professor',
            organization: 'QIS College of Engineering and Technology, Ongole',
            period: 'Aug 2023 - May 2024',
            isCurrent: false,
            highlights: [
                'R&D Coordinator, Internship Coordinator, BOS member.',
                'IEEE Robotics and Automation Society Advisor.',
                'Courses: Semiconductor Device Physics, Electronics Devices & Circuits.'
            ]
        },
        {
            role: 'Teaching cum Research Assistant',
            organization: 'Vellore Institute of Technology, Vellore',
            period: '2016 - 2019',
            isCurrent: false,
            highlights: [
                'Assisted in teaching Electromagnetic waves and Transmissions Lines, and VLSI Design.'
            ]
        }
    ],
    publications: [
        {
            title: 'Design and Optimization of AlGaN/AlN/GaN L-SBD for Radiofrequency Applications',
            journal: 'ACS Omega [SCIE; IF: 4.3, Q1]',
            year: '2026',
            indexing: 'SCIE, IF: 4.3, Q1',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Dual-Functional Ni/4H-SiC Schottky Interfaces: Robust UV and X-ray Detection',
            journal: 'ACS Applied Electronic Materials',
            year: '2025',
            indexing: 'Scopus / Peer Reviewed',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Electrical Performance and Deep-Level Trap Characterization of p-CuGaO2/β-Ga2O3 Heterojunctions',
            journal: 'ACS Applied Materials & Interfaces',
            year: '2025',
            indexing: 'SCIE / High Impact',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Design of microwave β-(AlxGa1-x)2O3/Ga2O3 lateral Schottky barrier diodes',
            journal: 'Semicond. Sci. Technol',
            year: '2022',
            indexing: 'SCIE / Scopus',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Influence of surface trap states on RF/microwave performance of lateral AlGaN/GaN Schottky barrier diode',
            journal: 'Electromagnetic Waves and Applications [SCIE; IF: 1.3, Q2]',
            year: '2021',
            indexing: 'SCIE; IF: 1.3, Q2',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Modeling of Field Dependent Maxwell-Wagner Interfacial Capacitance for Bilayer Metal- Insulator-Metal (MIM) Capacitors',
            journal: 'Advanced Science Letters (Scopus)',
            year: '2018',
            indexing: 'Scopus',
            link: '',
            status: 'PUBLISHED'
        },
        {
            title: 'Battery charging optimization solar powered robot',
            journal: 'International Journal of Applied Engineering and Research (Scopus)',
            year: '2015',
            indexing: 'Scopus',
            link: '',
            status: 'PUBLISHED'
        }
    ],
    conferences: [
        {
            title: 'Multi-Stage ML Ensemble Framework for Predicting Organizational KPI Deviation and Policy-Driven Optimization',
            event: 'IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence & Networking (QPAIN)',
            location: 'Chittagong, Bangladesh',
            dates: '16/04/2026 – 18/04/2026',
            status: 'PRESENTED'
        },
        {
            title: 'Design of Power Optimized 1bit ALU Using Multiplexers in Cadence system 90 nm Technology',
            event: 'Proceeding of IMCEST-2025',
            location: 'Ongole, India',
            dates: '26/11/2025',
            status: 'PRESENTED'
        },
        {
            title: 'Low-Power VLSI Accelerator Architecture for AI-Enhanced Real Time Audio and Video Processing at the Network Edge',
            event: 'International Conference on Edge Computing & VLSI',
            location: 'Chennai, India',
            dates: '06/11/2025 – 07/11/2025',
            status: 'PRESENTED'
        },
        {
            title: 'An Enhanced Glaucoma Disease Detection through Deep CNN Using Fundus Data with Self-Attention-based Grey Wolf Optimization',
            event: 'Tenth International Conference on Science Technology Engineering and Mathematics (ICONSTEM)',
            location: 'Chennai, India',
            dates: '06/11/2025 – 07/11/2025',
            status: 'PRESENTED'
        },
        {
            title: 'Effect of Al-doping in p-type SnOx Thin Film Transistors: Physics and Modeling',
            event: 'IEEE conference proceedings (DELCON-2022)',
            location: 'New Delhi, India',
            dates: '11/02/2022 – 13/02/2022',
            status: 'PRESENTED'
        }
    ],
    bookChapters: [
        {
            title: 'Innovative Technologies and Intelligent Systems: Transforming the Future',
            details: 'ISBN-13 (24) 9788119821006, 2024 Royal Book Publishing',
            date: '25/03/2024',
            status: 'PUBLISHED'
        }
    ],
    patents: [
        {
            title: 'Intelligent Sanitary Pad with Smart Moisture Sensor',
            country: 'Germany',
            status: 'FILED',
            date: 'Nov 2025'
        },
        {
            title: 'AI Based Spectacles for Visually Impaired',
            country: 'India',
            status: 'GRANTED',
            date: 'Jan 2026'
        },
        {
            title: 'AI Based System and Method for Meal Recommendation',
            country: 'India',
            status: 'FILED',
            date: 'Mar 2025'
        },
        {
            title: 'Solar Powered Agriculture Robot',
            country: 'UK',
            status: 'GRANTED',
            date: 'Feb 2024'
        }
    ],
    fundedProjects: [
        {
            title: 'Smart Sanitary Pad System for Caregiver-Assisted Menstrual Hygiene',
            agency: 'IEEE WIE section',
            amount: '₹ 43,500',
            period: '2025 — Current',
            description: 'Developed an Innovative Smart Sanitary Pad System that leverages sensor-based monitoring and real-time alerts to assist caregivers of mentally challenged and disabled girls.',
            status: 'ONGOING'
        }
    ],
    activities: {
        organisational: [
            'Editor and Organiser of a 2-day National level Symposium "NATIONAL-LEVEL STUDENT SYMPOSIUM ON PIONEERING IDEAS, ANALYSIS, RESEARCH & KNOWLEDGE- S.P.A.R.K-2025", Oct 24-25, 2025, QISCET, Ongole.',
            'Member of organizing committee of QISFEST, Feb 6-8, 2024, 2025, & 2026 at QISCET, Ongole.',
            'Member of organizing committee of 2nd International Conference on Nanoscience and Nanotechnology 2019 (ICNAN\'19), Vellore Institute of Technology, India.',
            'Member of organizing committee of 1st International Conference on Nanoscience and Nanotechnology 2016 (ICNAN\'16), Vellore Institute of Technology, India.',
            'Member of “CAD (Center for Awareness and Discussion)” & “VSC (Vivekananda Study Circle)” from 2011-2012, G.Pulla Reddy Engineering College, India.'
        ],
        memberships: [
            'IEEE Member',
            'IEEE Robotics and Automation Society Member and Advisor'
        ],
        workshops: [
            {
                title: 'Pedagogical Strategies for 21st Century Learners (NITTTR)',
                institution: 'QISCET Ongole',
                dates: '23/06/2025 - 27/06/2025'
            },
            {
                title: 'Familiarisation Workshop on Quantum Computing',
                institution: 'IISC Bangalore',
                dates: '22/09/2025 - 26/09/2025'
            },
            {
                title: 'Advances in Semiconductor Technology for Next-Generation Devices',
                institution: 'IIITDM Kurnool',
                dates: '01/12/2025 - 06/12/2025'
            },
            {
                title: 'Emerging Technologies in Wireless Communications',
                institution: 'NEC, Palnadu',
                dates: '14/07/2025 - 19/07/2025'
            },
            {
                title: 'The Future of VLSI Design for Next-Generation Communication Standards',
                institution: 'IEEE Hyderabad Section',
                dates: 'May 2024'
            },
            {
                title: 'Online TCAD – Circuit Simulation Workshop',
                institution: 'IIT Bombay & Synopsys',
                dates: 'Aug 1-5, 2022'
            },
            {
                title: 'Organised drone workshop',
                institution: 'QISCET, Ongole',
                dates: '16/04/2026 - 17/04/2026'
            },
            {
                title: 'World Nano Congress on Advanced Science & Technology (WNCST)',
                institution: 'CNR',
                dates: '8-13 March 2021'
            },
            {
                title: 'Frontiers of Excellence in Wide and Ultrawide Bandgap Semiconductors',
                institution: 'IIT Bombay',
                dates: 'Dec 14-15, 2019'
            },
            {
                title: 'INUP Hands-on Training Workshop on Nanofabrication Technologies',
                institution: 'IIT Bombay',
                dates: 'May 22-24, 2017'
            }
        ],
        certifications: [
            'NPTEL: Semiconductor Devices and Circuits (12/10/2025)',
            'Modeling and Simulation of Nano-transistors (IIT Kanpur, Feb 2017)',
            'Flexible Electronics 2017 (IIT Kanpur, Jul 2017)'
        ],
        references: [
            {
                name: 'Dr. Ch. Hima Bindu',
                title: 'Principal',
                institution: 'Bapatla Womens Engineering College, AP',
                phone: '+91 9885396299'
            },
            {
                name: 'Dr. D. Kannadassan',
                title: 'Professor & HoD, SENSE',
                institution: 'Vellore Institute of Technology, Vellore, India',
                phone: '9944055243'
            }
        ]
    },
    contact: {
        location: 'Bhagyanagar 2nd line, 523001, Ongole, India',
        email: 'dudekulashaiksha91@gmail.com',
        phone: '+91 9884997816',
        linkedin: 'https://linkedin.com/in/shaik-sha-20b8781b5',
        scholar: 'https://scholar.google.com/citations?user=hOaphsYAAAAJ&hl=en'
    },
    gallery: []
};

// ==========================================
// RESILIENT LOCAL STORAGE ENGINE
// ==========================================

function readLocalPortfolio() {
    try {
        if (fs.existsSync(localDataFile)) {
            const data = fs.readFileSync(localDataFile, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading local portfolio:', e.message);
    }
    return defaultPortfolioData;
}

function writeLocalPortfolio(data) {
    try {
        fs.writeFileSync(localDataFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('Error writing local portfolio:', e.message);
    }
}

// Initialize local fallback file if not present
if (!fs.existsSync(localDataFile)) {
    writeLocalPortfolio(defaultPortfolioData);
}

// ==========================================
// MONGODB CONNECTION MANAGER
// ==========================================

let isMongoConnected = false;

async function tryConnectMongo() {
    const uris = [MONGODB_DIRECT_URI, MONGODB_URI].filter(Boolean);

    for (const uri of uris) {
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            isMongoConnected = true;
            console.log(' Connected to MongoDB Atlas successfully.');
            await syncLocalWithMongo();
            return true;
        } catch (err) {
            // Continue trying next URI
        }
    }

    isMongoConnected = false;
    console.log(' MongoDB Atlas is pending IP whitelist. Serving smoothly via local resilient storage.');
    console.log(' To connect Atlas directly: add 0.0.0.0/0 (or your IP) in MongoDB Atlas > Network Access.');
    return false;
}

async function syncLocalWithMongo() {
    if (!isMongoConnected) return;
    try {
        let doc = await Portfolio.findOne().sort({ updatedAt: -1 });
        if (!doc) {
            const localData = readLocalPortfolio();
            doc = await Portfolio.create(localData);
            console.log('Seeded MongoDB Atlas with portfolio data.');
        } else {
            // Update local file with Mongo's latest
            writeLocalPortfolio(doc.toObject());
        }

        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            await Admin.create({
                username: process.env.ADMIN_USER || 'admin',
                password: process.env.ADMIN_PASS || 'Shah321'
            });
            console.log('Default admin created in MongoDB Atlas.');
        }
    } catch (err) {
        console.warn('Sync notice:', err.message);
    }
}

// Initial connection attempt
tryConnectMongo();

// Background retry every 30 seconds
setInterval(() => {
    if (!isMongoConnected) {
        tryConnectMongo();
    }
}, 30000);

// Authentication Helper
const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.body?.token || (authHeader && authHeader.replace('Bearer ', ''));

    if (!token || !token.startsWith('admin-token-')) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please login again.' });
    }
    next();
};

// ==========================================
// ROUTES
// ==========================================

// Server & Storage Status
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        connectedToMongo: isMongoConnected,
        storage: isMongoConnected ? 'MongoDB Atlas' : 'Local Resilient Storage (Pending Atlas IP Whitelist)',
        ipNotice: 'Add 0.0.0.0/0 in MongoDB Atlas > Network Access to enable direct cloud cluster sync'
    });
});

// Admin Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let isValid = false;

        if (isMongoConnected) {
            const admin = await Admin.findOne({ username, password });
            if (admin) isValid = true;
        }

        // Environment & fallback credentials
        const validUsers = ['admin', 'shah', process.env.ADMIN_USER];
        const validPasses = ['Shah321', process.env.ADMIN_PASS];
        if (validUsers.includes(username) && validPasses.includes(password)) {
            isValid = true;
        }

        if (isValid) {
            const token = `admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            res.json({
                success: true,
                token,
                user: { username, role: 'admin' },
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Change Admin Password
app.post('/api/change-password', verifyAuth, async (req, res) => {
    const { newPassword, username } = req.body;
    if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
    }
    try {
        if (isMongoConnected) {
            await Admin.findOneAndUpdate(
                { username: username || 'admin' },
                { password: newPassword, updatedAt: Date.now() },
                { upsert: true }
            );
        }
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Portfolio Data
app.get('/api/portfolio', async (req, res) => {
    try {
        if (isMongoConnected) {
            let portfolio = await Portfolio.findOne().sort({ updatedAt: -1 });
            if (portfolio) {
                return res.json({ success: true, data: portfolio, storage: 'MongoDB Atlas' });
            }
        }
    } catch (err) {
        // Fall through to local storage
    }

    const localData = readLocalPortfolio();
    res.json({ success: true, data: localData, storage: 'Local File Cache' });
});

// Update Portfolio Data
app.put('/api/portfolio', verifyAuth, async (req, res) => {
    try {
        const updateData = req.body.data || req.body;
        delete updateData._id;
        delete updateData.__v;
        updateData.updatedAt = new Date();

        // Always save locally first so user never loses edits
        writeLocalPortfolio(updateData);

        // Also save to MongoDB if connected
        if (isMongoConnected) {
            await Portfolio.findOneAndUpdate(
                {},
                { $set: updateData },
                { new: true, upsert: true }
            );
        }

        res.json({
            success: true,
            message: isMongoConnected ? 'Portfolio updated in MongoDB Atlas!' : 'Portfolio saved locally! (Will sync with Atlas when connected)',
            storage: isMongoConnected ? 'MongoDB Atlas' : 'Local Storage',
            data: updateData
        });
    } catch (err) {
        console.error('Error saving portfolio:', err);
        res.status(500).json({ success: false, message: 'Failed to update portfolio: ' + err.message });
    }
});

// Image / File Upload
app.post('/api/upload', verifyAuth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded or file rejected' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// List Uploaded Media Images
app.get('/api/images', verifyAuth, (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const images = files.map(file => {
            const stats = fs.statSync(path.join(uploadsDir, file));
            return {
                filename: file,
                url: `/uploads/${file}`,
                size: (stats.size / 1024).toFixed(1) + ' KB',
                modified: stats.mtime
            };
        }).sort((a, b) => b.modified - a.modified);

        res.json({ success: true, files: images });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete Uploaded Image
app.delete('/api/images/:filename', verifyAuth, (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);

        if (!filePath.startsWith(uploadsDir)) {
            return res.status(400).json({ success: false, message: 'Invalid file path' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'File deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'File not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Reset Portfolio Data
app.post('/api/reset-portfolio', verifyAuth, async (req, res) => {
    try {
        writeLocalPortfolio(defaultPortfolioData);
        if (isMongoConnected) {
            await Portfolio.deleteMany({});
            await Portfolio.create(defaultPortfolioData);
        }
        res.json({ success: true, message: 'Portfolio reset to default successfully', data: defaultPortfolioData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Admin Server running at http://localhost:${PORT}`);
    console.log(`📁 Media uploads served at http://localhost:${PORT}/uploads`);
});
