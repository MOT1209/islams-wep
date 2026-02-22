const supabase = require('../db');

// جلب جميع تصنيفات الأذكار
exports.getAllCategories = async (req, res) => {
    try {
        // Fetch all categories
        const { data, error } = await supabase.from('azkar').select('category');
        if (error) throw error;

        // Extract distinct categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        res.json(uniqueCategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب الأذكار بناءً على التصنيف المختار
exports.getAzkarByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const { data, error } = await supabase
            .from('azkar')
            .select('zekr_text, count, read_time, fadl')
            .eq('category', category);

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'No Azkar found for this category' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
