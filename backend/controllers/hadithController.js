const supabase = require('../db');

// جلب جميع تصنيفات الأحاديث
exports.getAllCategories = async (req, res) => {
    try {
        const { data, error } = await supabase.from('hadiths').select('category');
        if (error) throw error;
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        res.json(uniqueCategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب جميع كتب الأحاديث
exports.getAllBooks = async (req, res) => {
    try {
        const { data, error } = await supabase.from('hadiths').select('book_name');
        if (error) throw error;
        const uniqueBooks = [...new Set(data.map(item => item.book_name))];
        res.json(uniqueBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب الأحاديث بناءً على التصنيف
exports.getHadithsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const { data, error } = await supabase
            .from('hadiths')
            .select('hadith_text, narrator, book_name, grade')
            .eq('category', category);

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'No Hadiths found for this category' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
