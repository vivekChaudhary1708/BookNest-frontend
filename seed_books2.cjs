const axios = require('axios');
const fs = require('fs');
const path = require('path');

const categories = [
    "Fiction", "Non-Fiction", "Science", "Technology", "History",
    "Biography", "Self-Help", "Romance", "Mystery", "Thriller",
    "Fantasy", "Horror", "Children", "Educational", "Comics",
    "Poetry", "Philosophy", "Religion", "Art", "Business"
];

const books = [];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchBooks() {
    for (const cat of categories) {
        try {
            console.log(`Fetching ${cat}...`);
            const res = await axios.get(`https://openlibrary.org/search.json?subject=${encodeURIComponent(cat.toLowerCase())}&limit=20`);
            const items = res.data.docs || [];
            
            let i = 0;
            for (const item of items) {
                if (i >= 10) break;
                if (!item.title) continue;
                
                const title = item.title;
                const desc = item.first_sentence ? (typeof item.first_sentence === 'string' ? item.first_sentence : item.first_sentence[0]) : `A highly recommended ${cat} book.`;
                let img = '';
                if (item.cover_i) {
                    img = `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`;
                } else {
                    continue; // we want REAL cover pictures
                }
                
                books.push({
                    name: title,
                    description: desc.length > 500 ? desc.substring(0, 497) + '...' : desc,
                    price: Math.floor(Math.random() * (1500 - 200 + 1)) + 200,
                    category: cat,
                    stock: Math.floor(Math.random() * 41) + 10,
                    imageUrl: img
                });
                i++;
            }
            
            // Add fallback books if less than 10
            while (i < 10) {
                books.push({
                    name: `${cat} Essentials Vol. ${i + 1}`,
                    description: `A highly recommended ${cat} book.`,
                    price: Math.floor(Math.random() * (1500 - 200 + 1)) + 200,
                    category: cat,
                    stock: Math.floor(Math.random() * 41) + 10,
                    imageUrl: `https://placehold.co/600x900/1E293B/F59E0B?text=${cat}+Vol+${i+1}`
                });
                i++;
            }
        } catch (e) {
            console.error(`Error fetching ${cat}`, e.message);
            // Fallback for this category
            for (let i = 0; i < 10; i++) {
                books.push({
                    name: `${cat} Essentials Vol. ${i + 1}`,
                    description: `A highly recommended ${cat} book.`,
                    price: Math.floor(Math.random() * (1500 - 200 + 1)) + 200,
                    category: cat,
                    stock: Math.floor(Math.random() * 41) + 10,
                    imageUrl: `https://placehold.co/600x900/1E293B/F59E0B?text=${cat}+Vol+${i+1}`
                });
            }
        }
        await sleep(500); // Wait 0.5s to avoid rate limits
    }
    
    const targetDir = path.join(__dirname, '..', 'backend', 'product-service', 'src', 'main', 'resources');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, 'books-seed.json');
    fs.writeFileSync(targetPath, JSON.stringify(books, null, 2));
    console.log(`Saved to ${targetPath}`);
}

fetchBooks();
