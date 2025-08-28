        // משתני נגישות
        let activeFeatures = new Set();

        // פתיחה וסגירה של תפריט הנגישות
        function toggleAccessibilityMenu() {
            const menu = document.getElementById('accessibilityMenu');
            const overlay = document.querySelector('.accessibility-overlay');
            
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function closeAccessibilityMenu() {
            const menu = document.getElementById('accessibilityMenu');
            const overlay = document.querySelector('.accessibility-overlay');
            
            menu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // הפעלה וביטול של תכונות נגישות
        function toggleFeature(feature) {
            const element = document.querySelector(`[data-feature="${feature}"]`);
            
            if (activeFeatures.has(feature)) {
                // ביטול התכונה
                activeFeatures.delete(feature);
                element.classList.remove('active');
                disableFeature(feature);
            } else {
                // הפעלת התכונה
                activeFeatures.add(feature);
                element.classList.add('active');
                enableFeature(feature);
            }
            saveSettings();
        }

        function enableFeature(feature) {
            const body = document.body;
            
            switch(feature) {
                case 'contrast':
                    body.classList.add('high-contrast');
                    break;
                case 'invert':
                    body.classList.add('invert-colors');
                    break;
                case 'links':
                    body.classList.add('highlight-links');
                    break;
                case 'headings':
                    body.classList.add('highlight-headings');
                    break;
                case 'zoom':
                    body.classList.add('grayscale');
                    break;
                case 'font':
                    body.style.filter = 'contrast(150%)';
                    break;
                case 'cursor-black':
                    body.classList.add('big-cursor');
                    break;
                case 'cursor-white':
                    body.classList.add('white-cursor');
                    break;
                case 'monochrome':
                    body.classList.add('monochrome');
                    break;
                case 'underline':
                    body.classList.add('sepia');
                    break;
                case 'reading':
                    body.classList.add('reading-mode');
                    break;
                case 'screen-magnify':
                    body.classList.add('magnify');
                    break;
            }
        }

        function disableFeature(feature) {
            const body = document.body;
            
            switch(feature) {
                case 'contrast':
                    body.classList.remove('high-contrast');
                    break;
                case 'invert':
                    body.classList.remove('invert-colors');
                    break;
                case 'links':
                    body.classList.remove('highlight-links');
                    break;
                case 'headings':
                    body.classList.remove('highlight-headings');
                    break;
                case 'zoom':
                    body.classList.remove('grayscale');
                    break;
                case 'font':
                    body.style.filter = '';
                    break;
                case 'cursor-black':
                    body.classList.remove('big-cursor');
                    break;
                case 'cursor-white':
                    body.classList.remove('white-cursor');
                    break;
                case 'monochrome':
                    body.classList.remove('monochrome');
                    break;
                case 'underline':
                    body.classList.remove('sepia');
                    break;
                case 'reading':
                    body.classList.remove('reading-mode');
                    break;
                case 'screen-magnify':
                    body.classList.remove('magnify');
                    break;
            }
        }

        // איפוס כל התכונות
        function resetAllFeatures() {
            // איפוס כל התכונות הפעילות
            activeFeatures.forEach(feature => {
                disableFeature(feature);
                const element = document.querySelector(`[data-feature="${feature}"]`);
                if (element) {
                    element.classList.remove('active');
                }
            });
            
            activeFeatures.clear();
            saveSettings();
        }

        // שמירת הגדרות בלוקל סטורייג'
        function saveSettings() {
            const settings = {
                activeFeatures: Array.from(activeFeatures)
            };
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        }

        function loadSettings() {
            const saved = localStorage.getItem('accessibilitySettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // טעינת תכונות פעילות
                settings.activeFeatures.forEach(feature => {
                    activeFeatures.add(feature);
                    const element = document.querySelector(`[data-feature="${feature}"]`);
                    if (element) {
                        element.classList.add('active');
                        enableFeature(feature);
                    }
                });
            }
        }

        // סגירת התפריט בלחיצה על ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAccessibilityMenu();
            }
        });

        // טעינת הגדרות בטעינת הדף
        document.addEventListener('DOMContentLoaded', loadSettings);
    