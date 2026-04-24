const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace <nav> with the hamburger button + <nav class="nav-menu" id="navMenu">
    // Only if it doesn't already exist.
    if (!html.includes('mobile-menu-btn')) {
        let newNav = `<button class="mobile-menu-btn" onclick="toggleMenu()" aria-label="Toggle menu">☰</button>\n    <nav class="nav-menu" id="navMenu">`;
        html = html.replace(/<nav>/g, newNav);
        fs.writeFileSync(file, html);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Skipped ${file} (already updated)`);
    }
});
