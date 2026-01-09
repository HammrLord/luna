
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * ReportService
 * Generates a HIGH-DENSITY 10-page clinical PDF report for Tina Khurana.
 * Focus: Eliminating whitespace with rich clinical data, extended tables, and deep narrative.
 */

// --- Synthetic Data Generators ---

const generateDailyLogs = (days: number) => {
    return Array.from({ length: days }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        calories: 1400 + Math.floor(Math.random() * 600),
        protein: 40 + Math.floor(Math.random() * 30),
        carbs: 180 + Math.floor(Math.random() * 80),
        steps: 3000 + Math.floor(Math.random() * 5000),
        sleep: 4 + Math.random() * 5,
        mood: ['Anxious', 'Stable', 'Low', 'Irritable', 'Happy'][Math.floor(Math.random() * 5)],
        hr: 65 + Math.floor(Math.random() * 15),
        symptom: ['Bloating', 'Acne Flare', 'Fatigue', 'Cramps', '-'][Math.floor(Math.random() * 5)]
    }));
};

const getPatientData = () => ({
    profile: {
        name: "Tina Khurana",
        dob: "Aug 12, 1998",
        age: 26,
        id: "MRN-PKH-2026-X99",
        bloodType: "B+",
        height: "162 cm",
        weight: "74 kg",
        bmi: "28.2 (Overweight)",
        insurance: "HDFC Ergo Health / Policy #992811",
        address: "42, Vasant Vihar, New Delhi - 110057",
        contact: "+91 98765 43210",
        physician: "Dr. Anjali Gupta (Endocrinologist)"
    },
    history: {
        diagnosisDate: "June 2022",
        family: [
            { relation: "Mother", condition: "Type 2 Diabetes", onset: "45 yrs" },
            { relation: "Maternal Aunt", condition: "PCOS / Infertility", onset: "22 yrs" },
            { relation: "Paternal Grandmother", condition: "Hypothyroidism", onset: "50 yrs" },
            { relation: "Father", condition: "Hypertension", onset: "55 yrs" }
        ],
        medications: [
            { name: "Metformin HCl", dose: "500 mg", freq: "BD (Twice)", start: "Jul 2022", adherence: "88%", sideEffects: "Mild GI distress" },
            { name: "Myo-Inositol", dose: "2000 mg", freq: "OD (Once)", start: "Aug 2023", adherence: "92%", sideEffects: "None" },
            { name: "Vitamin D3", dose: "60k IU", freq: "Weekly", start: "Jan 2024", adherence: "100%", sideEffects: "None" },
            { name: "Omega-3 Fish Oil", dose: "1000 mg", freq: "OD (Once)", start: "Jan 2024", adherence: "65%", sideEffects: "Fishy burps" }
        ],
        allergies: "Penicillin (Anaphylaxis), Peanuts (Mild), Dust Mites",
        surgeries: "Appendectomy (Laparoscopic, 2015)",
        lifestyle: "Sedentary job (Senior UI Designer), 9-10h screen time. Irregular meal timings reported."
    },
    logs: generateDailyLogs(60), // 60 days of data for appendices
    mealLogs: [
        { time: "08:30 AM", food: "Aloo Paratha (2) + Butter + Curd", cals: 550, gl: "High", lipid: "High", protein: "12g", note: "Traditional breakfast, high sat fat." },
        { time: "11:00 AM", food: "Masala Chai (Full Sugar) + Rusks", cals: 180, gl: "High", lipid: "Low", protein: "3g", note: "Sugar spike source." },
        { time: "01:30 PM", food: "Rajma Chawal (Large Bowl)", cals: 600, gl: "Mod", lipid: "Low", protein: "18g", note: "Good fiber, but portion size large." },
        { time: "05:00 PM", food: "Digestive Biscuits (4) + Coffee", cals: 280, gl: "High", lipid: "High", protein: "3g", note: "Evening slump snacking." },
        { time: "07:00 PM", food: "Maggie Noodles (Snack)", cals: 350, gl: "High", lipid: "High", protein: "6g", note: "Ultra-processed craving." },
        { time: "09:30 PM", food: "Grilled Chicken Salad + Soup", cals: 350, gl: "Low", lipid: "Mod", protein: "35g", note: "Optimal meal choice." },
        { time: "11:00 PM", food: "Haldiram Bhujia (Handful)", cals: 150, gl: "Mod", lipid: "High", protein: "4g", note: "Late night stress eating." },
    ]
});

export const generateMedicalReport = async () => {
    const data = getPatientData();

    // --- CHART GENERATORS (SVG) ---
    // 1. Slepp Trend
    const generateSleepChart = () => {
        const points = data.logs.slice(0, 30).reverse().map((d, i) => `${i * 20 + 20},${100 - (d.sleep * 10)}`).join(' ');
        return `
            <svg width="100%" height="150" viewBox="0 0 650 150">
                <rect width="100%" height="100%" fill="#f8f9fa" rx="4"/>
                <line x1="0" y1="20" x2="650" y2="20" stroke="#ddd" stroke-width="1" />
                <line x1="0" y1="60" x2="650" y2="60" stroke="#ddd" stroke-width="1" />
                <line x1="0" y1="100" x2="650" y2="100" stroke="#a5d6a7" stroke-width="20" opacity="0.3" /> <!-- Target Zone -->
                <polyline points="${points}" fill="none" stroke="#1565c0" stroke-width="2" />
                ${data.logs.slice(0, 30).map((d, i) => `<circle cx="${i * 20 + 20}" cy="${100 - (d.sleep * 10)}" r="2.5" fill="#0d47a1"/>`).join('')}
                <text x="10" y="15" font-size="9" fill="#999">8 Hours</text>
                <text x="10" y="55" font-size="9" fill="#999">4 Hours</text>
                <text x="550" y="140" font-size="10" fill="#666">Sleep Duration (Last 30 Days)</text>
            </svg>
        `;
    };

    // 2. Calorie Consistency
    const generateCalorieDist = () => {
        return `
            <svg width="100%" height="150" viewBox="0 0 650 150">
               <rect width="100%" height="100%" fill="#fff3e0" rx="4"/>
               ${data.logs.slice(0, 30).map((d, i) => {
            const h = Math.min((d.calories / 3000) * 100, 100);
            return `<rect x="${i * 20 + 15}" y="${130 - h}" width="12" height="${h}" fill="${d.calories > 1800 ? '#ef6c00' : '#8bc34a'}" opacity="0.9" />`;
        }).join('')}
               <line x1="0" y1="130" x2="650" y2="130" stroke="#555" stroke-width="1" />
               <line x1="0" y1="70" x2="650" y2="70" stroke="#ef6c00" stroke-dasharray="4" />
               <text x="550" y="20" font-size="10" fill="#666">Caloric Intake vs Target</text>
            </svg>
        `;
    };

    const styles = `
        @page { size: A4; margin: 0; }
        body { font-family: 'Helvetica', sans-serif; color: #111; margin: 0; background: #fff; line-height: 1.4; }
        .page { width: 210mm; height: 297mm; padding: 15mm 20mm; box-sizing: border-box; page-break-after: always; position: relative; border-bottom: 1px solid #eee; }
        .page:last-child { page-break-after: avoid; }
        
        h1 { color: #E91E63; margin: 0; font-size: 26px; letter-spacing: -0.5px; font-weight: 700; }
        h2 { color: #2c3e50; border-bottom: 2px solid #E91E63; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        h3 { color: #555; font-size: 14px; margin-top: 15px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; background: #eee; padding: 5px 10px; border-left: 3px solid #888; }
        
        .header-row { display: flex; justify-content: space-between; border-bottom: 3px solid #333; padding-bottom: 15px; margin-bottom: 30px; align-items: flex-end; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        
        .box { background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #e0e0e0; }
        .label { font-size: 9px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.5px; }
        .value { font-size: 13px; font-weight: 600; color: #000; }
        
        /* High density table */
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
        th { text-align: left; background: #263238; color: #fff; padding: 8px 10px; font-weight: 600; text-transform: uppercase; font-size: 10px; }
        td { border-bottom: 1px solid #e0e0e0; padding: 8px 10px; color: #333; }
        tr:nth-child(even) { background: #fcfcfc; }
        tr:hover { background: #fffde7; }
        
        .footer { position: absolute; bottom: 12mm; left: 20mm; right: 20mm; text-align: center; color: #999; font-size: 9px; border-top: 1px solid #eee; padding-top: 8px; font-family: monospace; }
        
        .tag { padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: bold; color: #fff; display: inline-block; min-width: 40px; text-align: center; }
        .tag.High { background: #e53935; }
        .tag.Mod { background: #fb8c00; }
        .tag.Low { background: #43a047; }
        
        .alert-box { background: #ffebee; border: 1px solid #ffcdd2; color: #b71c1c; padding: 10px; border-radius: 4px; font-size: 11px; margin-top: 10px; display: flex; align-items: center; gap: 10px; }
        
        p { margin-bottom: 10px; text-align: justify; font-size: 12px; }
        li { margin-bottom: 4px; font-size: 12px; }

        /* Compact Table for Appendices */
        .compact-table { font-size: 9px; }
        .compact-table th, .compact-table td { padding: 4px 6px; }
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><style>${styles}</style></head>
    <body>

        <!-- PAGE 1: EXECUTIVE SUMMARY -->
        <div class="page">
            <div class="header-row">
                <div>
                    <h1>MEDICAL RECORD</h1>
                    <div style="color: #666; font-size: 12px; margin-top: 2px;">LUNA HEALTH AI • COMPREHENSIVE ENDOCRINE REPORT</div>
                </div>
                <div style="text-align: right;">
                    <div class="label">Generated On</div>
                    <div class="value">${new Date().toDateString()}</div>
                    <div class="label" style="margin-top:5px;">Case Ref</div>
                    <div class="value">${data.profile.id}</div>
                </div>
            </div>

            <!-- Patient Demographics High Density -->
            <div class="box" style="margin-bottom: 25px; border-top: 4px solid #E91E63;">
                <div class="grid-3">
                    <div><div class="label">Patient Name</div><div class="value">${data.profile.name}</div></div>
                    <div><div class="label">DOB / Age</div><div class="value">${data.profile.dob} (${data.profile.age}y)</div></div>
                    <div><div class="label">Sex</div><div class="value">Female</div></div>
                    
                    <div><div class="label">BMI</div><div class="value" style="color:#d32f2f;">${data.profile.bmi}</div></div>
                    <div><div class="label">Blood Group</div><div class="value">${data.profile.bloodType}</div></div>
                    <div><div class="label">Primary Physician</div><div class="value">${data.profile.physician}</div></div>
                    
                    <div><div class="label">Address</div><div class="value">${data.profile.address}</div></div>
                    <div><div class="label">Contact</div><div class="value">${data.profile.contact}</div></div>
                    <div><div class="label">Insurance</div><div class="value">${data.profile.insurance}</div></div>
                </div>
            </div>

            <h2>1. Clinical Abstract</h2>
            <div style="column-count: 2; column-gap: 30px; font-size: 12px;">
                <p><strong>Chief Complaint:</strong> Patient presents with worsening oligomenorrhea (cycles >45 days), rapid weight gain (+5kg in 3 months), and significant dermatological distress (acne, hirsutism). Reports chronic fatigue and post-prandial somnolence.</p>
                <p><strong>Clinical Impression:</strong> Profile is consistent with <strong>Phenotype A (Insulin-Resistant) Polycystic Ovary Syndrome</strong>. Ultrasound confirms polycystic morphology. Blood panels indicate hyperinsulinemia (HOMA-IR > 3.0) and hyperandrogenism. There is a strong behavioral component with stress-induced eating patterns identified via AI logs.</p>
            </div>

            <div class="alert-box">
                <strong>🚨 CRITICAL ALERTS:</strong>
                <span>(1) Pre-diabetic HbA1c (5.8%), (2) High Glycemic Variability, (3) Severe Sleep Fragmentation, (4) High Cortisol Symptoms.</span>
            </div>

            <h3>Immediate Risk Stratification</h3>
            <table>
                <thead><tr><th>Risk Factor</th><th>Status</th><th>Score</th><th>Clinical Note</th></tr></thead>
                <tbody>
                    <tr><td>Type 2 Diabetes</td><td style="color:red; font-weight:bold;">HIGH</td><td>8/10</td><td>Family history + Insulin Resistance</td></tr>
                    <tr><td>Cardiovascular</td><td style="color:orange; font-weight:bold;">MODERATE</td><td>5/10</td><td>Elevated Lipid profile detected</td></tr>
                    <tr><td>Endometrial Hyperplasia</td><td style="color:orange; font-weight:bold;">MODERATE</td><td>6/10</td><td>Due to unopposed estrogen (missed periods)</td></tr>
                    <tr><td>Mental Health</td><td style="color:red; font-weight:bold;">HIGH</td><td>7/10</td><td>Anxiety symptoms dominant</td></tr>
                </tbody>
            </table>

            <div class="footer">Page 1 of 10 • Generated by Luna Health System</div>
        </div>

        <!-- PAGE 2: DETAILED HISTORY -->
        <div class="page">
            <h2>2. Comprehensive History</h2>
            
            <div class="grid-2">
                <div>
                    <h3>Diagnostic Timeline</h3>
                    <ul style="font-size: 11px; padding-left: 15px;">
                        <li><strong>Jun 2022:</strong> Initial Diagnosis via TVS Ultrasound (Right Ovary: 12cc, Left: 14cc).</li>
                        <li><strong>Dec 2023:</strong> Metformin therapy initiated due to rising HbA1c.</li>
                        <li><strong>Jan 2024:</strong> Dermatology consult for resistant acne.</li>
                        <li><strong>Current:</strong> Reporting worsening symptoms despite medication.</li>
                    </ul>
                </div>
                <div>
                     <h3>Lifestyle Factors</h3>
                     <div class="box">
                        <div class="label">Occupation</div><div class="value">Senior UI Designer (High Stress)</div>
                        <div class="label" style="margin-top:5px;">Screen Time</div><div class="value">9-10 Hours/Day (Blue light exposure)</div>
                        <div class="label" style="margin-top:5px;">Dietary Pattern</div><div class="value">Irregular, late-night caloric loading.</div>
                     </div>
                </div>
            </div>

            <h3>Family Medical History</h3>
            <table>
                <thead><tr><th>Relation</th><th>Condition</th><th>Age of Onset</th><th>Genetic Risk Implication</th></tr></thead>
                <tbody>
                    ${data.history.family.map(f => `<tr><td>${f.relation}</td><td>${f.condition}</td><td>${f.onset}</td><td>High (Direct Lineage)</td></tr>`).join('')}
                </tbody>
            </table>

            <h3>Pharmacological Management</h3>
            <table>
                <thead><tr><th>Medication/Supplement</th><th>Dosage</th><th>Regimen</th><th>Start Date</th><th>Adherence</th><th>Side Effects</th></tr></thead>
                <tbody>
                    ${data.history.medications.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.dose}</td><td>${m.freq}</td><td>${m.start}</td><td>${m.adherence}</td><td>${m.sideEffects}</td></tr>`).join('')}
                </tbody>
            </table>
            
            <h3>Surgical & Obstetric History</h3>
            <div class="grid-2">
                 <div class="box"><div class="label">Surgeries</div><div class="value">${data.history.surgeries}</div></div>
                 <div class="box"><div class="label">Parity</div><div class="value">Nulliparous (G0 P0)</div></div>
            </div>

            <div class="footer">Page 2 of 10 • Patient: ${data.profile.id} • History</div>
        </div>

        <!-- PAGE 3: METABOLIC DEEP DIVE -->
        <div class="page">
            <h2>3. Metabolic & Nutritional Analysis</h2>
            <p><strong>Assessment Method:</strong> 60-Day AI Vision Logs (180+ Meals analyzed).<br/><strong>Summary:</strong> Patient exhibits a "Back-loaded" caloric intake pattern, consuming >60% of calories after 6 PM, exacerbating insulin resistance.</p>

            <h3>Monthly Caloric Pattern</h3>
            ${generateCalorieDist()}

            <h3>Macronutrient Density (Average Daily Intake)</h3>
             <table>
                <thead><tr><th>Nutrient</th><th>Amount</th><th>% Energy</th><th>Target</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td><strong>Protein</strong></td><td>45g</td><td style="color:red;">12%</td><td>30%</td><td>Deficient (-40g)</td></tr>
                    <tr><td><strong>Carbohydrates</strong></td><td>220g</td><td style="color:red;">58%</td><td>35%</td><td>Excess (Esp. Simple Carbs)</td></tr>
                    <tr><td><strong>Total Fat</strong></td><td>50g</td><td>30%</td><td>35%</td><td>Optimal Range</td></tr>
                    <tr><td><em>  Saturated Fat</em></td><td>22g</td><td>12%</td><td><10%</td><td>Elevated</td></tr>
                    <tr><td><strong>Fiber</strong></td><td>14g</td><td>-</td><td>25g</td><td>Deficient</td></tr>
                </tbody>
            </table>

            <h3>Micronutrient Gap Analysis (Estimated)</h3>
            <div class="grid-3">
                 <div class="box">
                    <div class="label">Magnesium</div>
                    <div class="value alert">Low Risk</div>
                    <div style="font-size:10px;">Sources: Green veg absent.</div>
                </div>
                 <div class="box">
                    <div class="label">Zinc</div>
                    <div class="value alert">Deficient</div>
                    <div style="font-size:10px;">Crucial for androgen control.</div>
                </div>
                 <div class="box">
                    <div class="label">Vitamin B12</div>
                    <div class="value">Borderline</div>
                    <div style="font-size:10px;">Monitor due to Metformin use.</div>
                </div>
            </div>
            
            <h3>Glycemic Load Distribution</h3>
            <div style="display:flex; gap: 5px; margin-top: 10px;">
                <div style="background:#e53935; width:45%; height:20px; border-radius:3px;"></div>
                <div style="background:#fb8c00; width:30%; height:20px; border-radius:3px;"></div>
                <div style="background:#43a047; width:25%; height:20px; border-radius:3px;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#666; margin-top:2px;">
                <span>High GL (45%)</span><span>Mod GL (30%)</span><span>Low GL (25%)</span>
            </div>

            <div class="footer">Page 3 of 10 • Metabolic Analytics</div>
        </div>

        <!-- PAGE 4: DETAILED NUTRITION LOGS -->
        <div class="page">
            <h2>4. Dietary Log Sample & Analysis</h2>
            <p>Detailed breakdown of a representative day illustrating the "Glucose Rollercoaster" phenomenon.</p>
            
            <table>
                <thead><tr><th>Time</th><th>Food Item & Description</th><th>Kcal</th><th>Prot</th><th>Impact Analysis</th></tr></thead>
                <tbody>
                    ${data.mealLogs.map(m => `
                        <tr>
                            <td>${m.time}</td>
                            <td>
                                <strong>${m.food.split('+')[0]}</strong>
                                <div style="font-size:9px; color:#666;">${m.note}</div>
                            </td>
                            <td>${m.cals}</td>
                            <td>${m.protein}</td>
                            <td>
                                <span class="tag ${m.gl}">${m.gl} GL</span>
                                <span class="tag ${m.lipid === 'High' ? 'High' : 'Low'}">Lipids</span>
                            </td>
                        </tr>
                    `).join('')}
                    ${data.mealLogs.map(m => `
                        <tr>
                            <td>${m.time}</td>
                            <td>
                                <strong>${m.food.split('+')[0]}</strong>
                                <div style="font-size:9px; color:#666;">${m.note}</div>
                            </td>
                            <td>${m.cals}</td>
                            <td>${m.protein}</td>
                            <td>
                                <span class="tag ${m.gl}">${m.gl} GL</span>
                                <span class="tag ${m.lipid === 'High' ? 'High' : 'Low'}">Lipids</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="box" style="margin-top:20px; background:#e3f2fd; border-color:#90caf9;">
                <strong>💡 Clinical Interpretation:</strong>
                <p style="margin:0;">The breakfast (Aloo Paratha) initiates a high insulin release. The mid-morning "Sugar Spike" (Chai + Rusks) compounds this. By 5 PM, reactive hypoglycemia likely triggers the "Biscuit/Coffee" craving. The late dinner ensures insulin levels remain elevated during early sleep phases, inhibiting growth hormone release and fat oxidation.</p>
            </div>

            <div class="footer">Page 4 of 10 • Nutrition Logs</div>
        </div>

        <!-- PAGE 5: SLEEP & CIRCADIAN -->
        <div class="page">
            <h2>5. Sleep Architecture & Circadian Physiology</h2>
            <p><strong>Device Data:</strong> Validated via wearable integration.<br/><strong>Diagnosis:</strong> Delayed Sleep Phase Syndrome (DSPS) with moderate fragmentation.</p>
            
            <h3>30-Day Sleep Duration Trend</h3>
            ${generateSleepChart()}

            <h3>Detailed Sleep Metrics</h3>
            <table>
                <thead><tr><th>Metric</th><th>Patient Avg</th><th>Target</th><th>Status</th><th>Hormonal Impact</th></tr></thead>
                <tbody>
                    <tr><td>Total Sleep Time</td><td>6h 15m</td><td>7h - 9h</td><td style="color:red;">Insufficient</td><td>Cortisol Elevation</td></tr>
                    <tr><td>Deep Sleep (N3)</td><td>45 mins</td><td>90 mins</td><td style="color:red;">Deficient</td><td>Reduced Glucose Control</td></tr>
                    <tr><td>REM Sleep</td><td>95 mins</td><td>90 mins</td><td style="color:green;">Normal</td><td>Emotional Processing</td></tr>
                    <tr><td>Sleep Latency</td><td>45 mins</td><td>< 20 mins</td><td style="color:orange;">Delayed</td><td>Melatonin Suppression</td></tr>
                    <tr><td>Wake After Onset</td><td>35 mins</td><td>< 20 mins</td><td style="color:orange;">Fragmented</td><td>Nocturnal Stress</td></tr>
                </tbody>
            </table>
            
            <h3>Sleep Hygiene Audit</h3>
            <div class="grid-2">
                 <div class="box">
                     <div class="label">Caffeine Cut-off</div>
                     <div class="value alert">Failed (Last intake: 6:30 PM)</div>
                 </div>
                 <div class="box">
                     <div class="label">Bedroom Environment</div>
                     <div class="value">24°C (Too Warm) / Light Pollution</div>
                 </div>
                 <div class="box">
                     <div class="label">Pre-sleep Routine</div>
                     <div class="value">Social Media Scrolling (Blue Light)</div>
                 </div>
                 <div class="box">
                     <div class="label">Consistency Score</div>
                     <div class="value">42/100 (Erratic Bedtimes)</div>
                 </div>
            </div>

            <div class="footer">Page 5 of 10 • Sleep Physiology</div>
        </div>

        <!-- PAGE 6: PHYSICAL ACTIVITY -->
        <div class="page">
            <h2>6. Functional Capacity & Activity</h2>
            
            <div class="grid-3">
                 <div class="box">
                     <div class="label">Avg Daily Steps</div>
                     <div class="value">4,200</div>
                     <div class="label">Sedentary Profile</div>
                 </div>
                 <div class="box">
                     <div class="label">Resting HR</div>
                     <div class="value">72 bpm</div>
                     <div class="label">Cardio Fitness: Low</div>
                 </div>
                 <div class="box">
                     <div class="label">NEAT Score</div>
                     <div class="value alert">Low</div>
                     <div class="label">Non-Exercise Activity</div>
                 </div>
            </div>

            <h3>Weekly Activity Log (Last 7 Days)</h3>
            <table>
                <thead><tr><th>Day</th><th>Steps</th><th>Workout</th><th>Duration</th><th>Est. Burn</th></tr></thead>
                <tbody>
                    <tr><td>Monday</td><td>3,200</td><td>None</td><td>0m</td><td>1400 kcal</td></tr>
                    <tr><td>Tuesday</td><td>5,100</td><td>Walking</td><td>20m</td><td>1650 kcal</td></tr>
                    <tr><td>Wednesday</td><td>2,800</td><td>None</td><td>0m</td><td>1380 kcal</td></tr>
                    <tr><td>Thursday</td><td>6,000</td><td>Yoga</td><td>15m</td><td>1700 kcal</td></tr>
                    <tr><td>Friday</td><td>4,500</td><td>None</td><td>0m</td><td>1550 kcal</td></tr>
                    <tr><td>Saturday</td><td>2,100</td><td>None</td><td>0m</td><td>1300 kcal</td></tr>
                    <tr><td>Sunday</td><td>1,500</td><td>None</td><td>0m</td><td>1250 kcal</td></tr>
                </tbody>
            </table>
            
            <h3>Cardiovascular Risk Assessment</h3>
            <p>Sedentary behavior >10 hours/day is an independent risk factor for metabolic syndrome. Current activity levels are insufficient to sensitize insulin receptors (GLUT4 translocation).</p>
            <div class="box" style="border-left: 3px solid #E91E63;">
                <strong>Use Recommendation:</strong> Initiate "Exercise Snacking" - 10 minutes of brisk walking post-meals (especially dinner) to flatten glucose curves.
            </div>

            <div class="footer">Page 6 of 10 • Physical Activity</div>
        </div>

        <!-- PAGE 7: PSYCHOMETRIC -->
        <div class="page">
            <h2>7. Psychometric & Behavioral Health</h2>
            
            <h3>DASS-21 Scoring (Depression Anxiety Stress Scale)</h3>
            <table>
                <thead><tr><th>Scale</th><th>Score</th><th>Severity</th><th>Interpretation</th></tr></thead>
                <tbody>
                    <tr><td><strong>Depression</strong></td><td>14</td><td>Moderate</td><td>Loss of initiative, recurrent gloominess.</td></tr>
                    <tr><td><strong>Anxiety</strong></td><td>22</td><td style="color:red; font-weight:bold;">Severe</td><td>Physiological arousal, panic tremors.</td></tr>
                    <tr><td><strong>Stress</strong></td><td>18</td><td>Moderate</td><td>Difficulty relaxing, nervous energy.</td></tr>
                </tbody>
            </table>
            
            <h3>Behavioral Triggers & Coping</h3>
            <div class="grid-2">
                <div class="box">
                    <div class="label">Primary Stressor</div>
                    <div class="value">Body Image / Hirsutism</div>
                    <p style="margin:5px 0 0 0; font-size:10px;">User reports avoiding mirrors and social events due to facial hair visibility.</p>
                </div>
                <div class="box">
                    <div class="label">Coping Mechanism</div>
                    <div class="value alert">Maladaptive (Food)</div>
                    <p style="margin:5px 0 0 0; font-size:10px;">"Comfort eating" sugary foods noted after stressful work calls.</p>
                </div>
            </div>
            
            <h3>Chatbot Sentiment Analysis (NLP)</h3>
            <ul style="font-size:11px;">
                <li><strong>Keywords:</strong> "Tired", "Ugly", "Fat", "Bloated", "Crying".</li>
                <li><strong>Temporal Pattern:</strong> Mood dips significantly on Sunday evenings (Pre-work anxiety).</li>
                <li><strong>Compliance Analysis:</strong> Motivation is high in AM but depletes by 4 PM (Decision Fatigue).</li>
            </ul>

            <div class="footer">Page 7 of 10 • Mental Health</div>
        </div>

        <!-- PAGE 8: EXTENDED LAB PANEL -->
        <div class="page">
            <h2>8. Extended Endocrine & Lipid Panel</h2>
            <p>Simulated recent lab results for clinical correlation.</p>
            
            <h3>Androgen Profile</h3>
            <table>
                <thead><tr><th>Marker</th><th>Value</th><th>Ref Range</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>Total Testosterone</td><td>55 ng/dL</td><td>15-45</td><td style="color:red;">HIGH</td></tr>
                    <tr><td>Free Testosterone</td><td>4.2 pg/mL</td><td>0.1-6.4</td><td>Normal</td></tr>
                    <tr><td>DHEAS</td><td>350 ug/dL</td><td>35-430</td><td>High-Normal</td></tr>
                    <tr><td>SHBG</td><td>25 nmol/L</td><td>> 30</td><td style="color:orange;">LOW</td></tr>
                    <tr><td>FAI (Free Androgen Index)</td><td>7.2</td><td>< 5.0</td><td style="color:red;">ELEVATED</td></tr>
                </tbody>
            </table>
            
            <h3>Metabolic Panel</h3>
             <table>
                <thead><tr><th>Marker</th><th>Value</th><th>Ref Range</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>HbA1c</td><td>5.8 %</td><td>< 5.7</td><td style="color:orange;">PRE-DIABETIC</td></tr>
                    <tr><td>Fasting Glucose</td><td>98 mg/dL</td><td>70-99</td><td>Normal</td></tr>
                    <tr><td>Fasting Insulin</td><td>18 uIU/mL</td><td>< 10</td><td style="color:red;">Hyperinsulinemia</td></tr>
                    <tr><td>HOMA-IR</td><td>4.3</td><td>< 2.5</td><td style="color:red;">Insulin Resistant</td></tr>
                </tbody>
            </table>
            
            <h3>Lipid Profile</h3>
             <table>
                <thead><tr><th>Marker</th><th>Value</th><th>Ref Range</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>Total Cholesterol</td><td>210 mg/dL</td><td>< 200</td><td style="color:orange;">Borderline</td></tr>
                    <tr><td>LDL (Bad)</td><td>135 mg/dL</td><td>< 100</td><td style="color:orange;">High</td></tr>
                    <tr><td>HDL (Good)</td><td>38 mg/dL</td><td>> 50</td><td style="color:red;">Low</td></tr>
                    <tr><td>Triglycerides</td><td>180 mg/dL</td><td>< 150</td><td style="color:orange;">High</td></tr>
                </tbody>
            </table>

             <h3>Thyroid Function</h3>
             <table>
                <thead><tr><th>Marker</th><th>Value</th><th>Ref Range</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>TSH</td><td>3.5 mIU/L</td><td>0.4-4.0</td><td>Normal</td></tr>
                    <tr><td>T4 Free</td><td>1.1 ng/dL</td><td>0.8-1.8</td><td>Normal</td></tr>
                    <tr><td>Anti-TPO</td><td>15 IU/mL</td><td>< 9</td><td style="color:orange;">Mild Elevation</td></tr>
                </tbody>
            </table>

            <div class="footer">Page 8 of 10 • Lab Panel</div>
        </div>

        <!-- PAGE 9: APPENDIX I (RAW DATA) -->
        <div class="page">
            <h2>9. Appendix I: Daily Monitoring Logs (Days 1-30)</h2>
            <table class="compact-table">
                <thead><tr><th>Date</th><th>Sleep (h)</th><th>Steps</th><th>Mood</th><th>HR</th><th>Main Symptom</th></tr></thead>
                <tbody>
                    ${data.logs.slice(0, 30).map(l => `
                        <tr>
                            <td>${l.date}</td>
                            <td>${l.sleep.toFixed(1)}</td>
                            <td>${l.steps}</td>
                            <td>${l.mood}</td>
                            <td>${l.hr}</td>
                            <td>${l.symptom}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
             <div class="footer">Page 9 of 10 • Raw Data</div>
        </div>

        <!-- PAGE 10: APPENDIX II (RAW DATA) -->
        <div class="page">
            <h2>10. Appendix II: Daily Monitoring Logs (Days 31-60)</h2>
            <table class="compact-table">
                <thead><tr><th>Date</th><th>Sleep (h)</th><th>Steps</th><th>Mood</th><th>HR</th><th>Main Symptom</th></tr></thead>
                <tbody>
                    ${data.logs.slice(30, 60).map(l => `
                        <tr>
                            <td>${l.date}</td>
                            <td>${l.sleep.toFixed(1)}</td>
                            <td>${l.steps}</td>
                            <td>${l.mood}</td>
                            <td>${l.hr}</td>
                            <td>${l.symptom}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h3>End of Report</h3>
            <p style="font-size: 10px; color: #999;">This report is computer-generated by the Luna PCOD Management System. It is intended for informational and clinical decision support purposes only and does not constitute a definitive medical diagnosis.</p>
            
             <div class="footer">Page 10 of 10 • Raw Data • End of Record</div>
        </div>

    </body>
    </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });

        await Sharing.shareAsync(uri, {
            UTI: '.pdf',
            mimeType: 'application/pdf'
        });

    } catch (error) {
        console.error('Failed to generate report:', error);
    }
};
