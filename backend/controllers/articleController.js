const supabase = require('../db');

// جلب جميع المقالات مع أسماء مؤلفيها
exports.getAllArticles = async (req, res) => {
    try {
        // Supabase allows fetching relational data if there's a foreign key setup
        // Syntax for nested select: select('*, users(username)')
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, content, category, published_at, views_count, users(username)')
            .order('published_at', { ascending: false });

        if (error) throw error;

        // Map the results to match previous API response
        const mappedData = data.map(article => ({
            id: article.id,
            title: article.title,
            excerpt: article.content ? article.content.substring(0, 150) : '',
            author_name: article.users ? article.users.username : 'بدون مؤلف',
            category: article.category,
            published_at: article.published_at,
            views_count: article.views_count
        }));

        res.json(mappedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب مقال بالمعرف الخاص به مع زيادة عدد المشاهدات
exports.getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Fetch current article first to increment view count by 1 in code
        // (Since Supabase doesn't easily support X = X + 1 without RPC)
        const { data: currentArt, error: selectErr } = await supabase
            .from('articles')
            .select('id, title, content, category, published_at, views_count, users(username)')
            .eq('id', id)
            .single();

        if (selectErr || !currentArt) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // 2. Increment view count
        const newViewsCount = (currentArt.views_count || 0) + 1;
        const { error: updateErr } = await supabase
            .from('articles')
            .update({ views_count: newViewsCount })
            .eq('id', id);

        if (updateErr) console.error("Could not update views count:", updateErr);

        // Map response
        const responseData = {
            id: currentArt.id,
            title: currentArt.title,
            content: currentArt.content,
            author_name: currentArt.users ? currentArt.users.username : 'بدون مؤلف',
            category: currentArt.category,
            published_at: currentArt.published_at,
            views_count: newViewsCount
        };

        res.json(responseData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
