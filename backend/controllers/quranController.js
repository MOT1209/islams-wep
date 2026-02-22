const supabase = require('../db');

// الحصول على قائمة بجميع سور القرآن
exports.getAllSurahs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('quran')
            .select('surah_number, surah_name');
        // Supabase returns all rows, so we need to filter distinct in JS or use RPC, 
        // but since a surah has many ayahs, we can simply fetch unique surahs:

        if (error) throw error;

        // Filter out unique surahs
        const uniqueSurahsMap = new Map();
        data.forEach(item => {
            if (!uniqueSurahsMap.has(item.surah_number)) {
                uniqueSurahsMap.set(item.surah_number, item);
            }
        });

        const uniqueSurahs = Array.from(uniqueSurahsMap.values()).sort((a, b) => a.surah_number - b.surah_number);

        res.json(uniqueSurahs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// الحصول على آيات سورة محددة
exports.getSurahAyahs = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('quran')
            .select('ayah_number, ayah_text')
            .eq('surah_number', id)
            .order('ayah_number', { ascending: true });

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ message: 'Surah not found or no ayahs' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
