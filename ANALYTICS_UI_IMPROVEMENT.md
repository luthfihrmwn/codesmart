# Analytics Page - UI Improvement

## Perubahan yang Dilakukan

### 1. Header Tabel At-Risk Students dengan Gradient Purple

**Sebelum:**
```css
.risk-table th {
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    color: #374151;
    border-bottom: 3px solid #e5e7eb;
}
```

**Sesudah:**
```css
.risk-table th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: 3px solid rgba(102, 126, 234, 0.3);
}
```

**Hasil:**
- Header tabel At-Risk Students sekarang menggunakan gradient purple yang konsisten
- Text berwarna putih untuk kontras yang lebih baik
- Border bottom menggunakan transparansi purple

### 2. Menambahkan Chart Kedua - Performance Statistics

**Penambahan HTML:**
```html
<!-- Performance Statistics Chart -->
<div class="chart-card">
    <h3>
        <i class='bx bx-trending-up'></i>
        Performance Statistics
    </h3>
    <div class="chart-container">
        <canvas id="performanceChart"></canvas>
    </div>
</div>
```

**Fungsi JavaScript Baru:**
```javascript
async function renderPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (charts.performanceChart) charts.performanceChart.destroy();

    try {
        const response = await fetch('http://localhost:5000/api/v1/analytics/grade-distribution', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('codesmart_token')}`
            }
        });
        const data = await response.json();

        if (data.success && data.data.statistics) {
            const stats = data.data.statistics;

            charts.performanceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Average Score', 'Min Score', 'Max Score', 'Std Deviation'],
                    datasets: [{
                        label: 'Performance Metrics',
                        data: [
                            parseFloat(stats.average_score) || 0,
                            stats.min_score || 0,
                            stats.max_score || 0,
                            parseFloat(stats.std_deviation) || 0
                        ],
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',  // Primary purple
                            'rgba(255, 107, 107, 0.8)',  // Danger red
                            'rgba(72, 187, 120, 0.8)',   // Success green
                            'rgba(237, 137, 54, 0.8)'    // Warning orange
                        ],
                        borderColor: [
                            'rgb(102, 126, 234)',
                            'rgb(255, 107, 107)',
                            'rgb(72, 187, 120)',
                            'rgb(237, 137, 54)'
                        ],
                        borderWidth: 2
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
                                padding: 15,
                                font: {
                                    size: 12,
                                    weight: '600'
                                },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed.toFixed(2);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading performance chart:', error);
    }
}
```

**Update loadDashboardData():**
```javascript
if (data.success) {
    dashboardData = data.data;
    renderStats();
    await loadGradeDistribution();
    await renderPerformanceChart();  // ← BARU
    await loadAtRiskStudents();
}
```

## Visualisasi Layout

### Grid Layout - 2 Charts Side by Side

```
┌─────────────────────────────────────────────────────────────┐
│                    Stats Overview Cards                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Total   │  │ Pending  │  │ Average  │  │ At-Risk  │  │
│  │ Students │  │  Submis  │  │  Score   │  │ Students │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Charts Grid (2 columns)                │
│  ┌────────────────────────┐  ┌────────────────────────┐   │
│  │   Grade Distribution   │  │ Performance Statistics │   │
│  │     (Bar Chart)        │  │    (Doughnut Chart)    │   │
│  │                        │  │                        │   │
│  │  ████ A (90-100)       │  │      ┌─────────┐      │   │
│  │  ████ B (80-89)        │  │     ╱           ╲     │   │
│  │  ████ C (70-79)        │  │    │  Avg Score  │    │   │
│  │                        │  │     ╲ Min  Max ╱      │   │
│  └────────────────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   At-Risk Students Table                    │
│  ╔══════════════════════════════════════════════════════╗  │
│  ║  Name  │  Email  │  Level  │  Score  │  Risk Level  ║  │ ← PURPLE GRADIENT
│  ╚══════════════════════════════════════════════════════╝  │
│  │ John   │ john@   │ Basic   │ 75.5%   │ [MEDIUM]     │  │
│  │ Sarah  │ sarah@  │ Inter   │ 45.2%   │ [HIGH]       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data yang Ditampilkan di Performance Statistics Chart

Chart doughnut menampilkan 4 metrik performa:

1. **Average Score** (Purple) - Nilai rata-rata semua submission
   - Contoh: 88.60

2. **Min Score** (Red) - Nilai minimum
   - Contoh: 78

3. **Max Score** (Green) - Nilai maksimum
   - Contoh: 96

4. **Std Deviation** (Orange) - Standar deviasi
   - Contoh: 5.74

Data diambil dari endpoint yang sama dengan Grade Distribution (`/api/v1/analytics/grade-distribution`) pada bagian `statistics`.

## Keuntungan Perubahan

### 1. Header Tabel Purple
- ✅ **Konsisten** dengan tema assessor (purple gradient)
- ✅ **Kontras Lebih Baik** - text putih di atas background purple
- ✅ **Visual Hierarchy** - header lebih menonjol dari body tabel
- ✅ **Professional** - gradient memberikan kesan modern

### 2. 2 Charts Berdampingan
- ✅ **Layout Seimbang** - tidak ada space kosong
- ✅ **Informasi Lebih Banyak** - user melihat 2 visualisasi sekaligus
- ✅ **Responsive** - akan stack ke 1 kolom di mobile
- ✅ **Complementary Data** - Grade Distribution (kategori) + Performance Statistics (metrics)

## Testing

### Visual Test
1. Buka: `http://localhost:8080/src/pages/assessor/analytics-sidebar.html`
2. Login dengan: `guru` / `guru123`
3. Verifikasi:
   - ✅ Header tabel At-Risk Students berwarna purple dengan text putih
   - ✅ 2 charts muncul berdampingan (Grade Distribution + Performance Statistics)
   - ✅ Performance Statistics menampilkan doughnut chart dengan 4 metrics
   - ✅ Warna charts konsisten dengan theme purple

### API Data Test
```bash
curl -s -X GET "http://localhost:5000/api/v1/analytics/grade-distribution" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.statistics'
```

Expected output:
```json
{
  "total_graded": "10",
  "average_score": "88.60",
  "min_score": 78,
  "max_score": 96,
  "std_deviation": "5.74"
}
```

## Files Modified

### `/home/luthfi/codesmart/src/pages/assessor/analytics-sidebar.html`

**Changes:**
1. **Line 309-319**: Updated `.risk-table th` with purple gradient background
2. **Line 964-973**: Added Performance Statistics chart card HTML
3. **Line 1187**: Added `await renderPerformanceChart();` call
4. **Line 1334-1415**: Added `renderPerformanceChart()` function

## Responsive Behavior

Karena menggunakan `.charts-grid` yang sudah ada dengan CSS:
```css
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
    margin-bottom: 3.5rem;
}

@media (max-width: 1200px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}
```

**Desktop (> 1200px)**: 2 charts side by side
**Tablet/Mobile (< 1200px)**: Charts stack vertically

## Color Scheme Summary

All elements now use consistent assessor colors:

| Element | Color |
|---------|-------|
| Table Header | Purple Gradient `#667eea → #764ba2` |
| Chart 1 (Bar) | Multi-color (A=Green, B=Purple, C=Orange, D=Red, F=Gray) |
| Chart 2 (Doughnut) | Purple, Red, Green, Orange |
| Stat Cards | Purple, Green, Orange, Blue |

## Next Steps (Optional Enhancements)

1. **Add animation** saat chart pertama kali render
2. **Add filter** untuk memfilter data berdasarkan date range
3. **Export functionality** untuk download chart sebagai image
4. **Real-time updates** dengan WebSocket atau polling
5. **Drill-down** klik pada chart untuk melihat detail
