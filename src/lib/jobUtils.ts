

// カテゴリ判定ロジック
export const getCategory = (title: string) => {
    const t = title.toLowerCase();

    const definitions = [
        {
            name: "エンジニア",
            keywords: ["エンジニア", "engineer", "python", "java", "ruby", "php", "go", "react", "next", "vue", "aws", "開発", "技術", "プログラマ", "技術", "テック", "tech", "ai", "機械学習"]
        },
        {
            name: "デザイナー",
            keywords: ["デザイン", "デザイナー", "design", "ui", "ux", "figma", "adobe", "photoshop", "illustrator", "クリエイティブ", "アート", "制作"]
        },
        {
            name: "マーケティング",
            keywords: ["マーケ", "広報", "sns", "seo", "ads", "広告", "リサーチ", "分析", "ブランディング", "pr", "marketing"]
        },
        {
            name: "編集/ライター",
            keywords: ["編集", "ライター", "writer", "editor", "記事", "執筆", "メディア", "コンテンツ", "書籍"]
        },
        {
            name: "企画",
            keywords: ["企画", "プランナー", "ディレクター", "pm", "プロダクトマネージャー", "planning", "direction", "ディレクション", "事業開発", "プロデュース"]
        },
        {
            name: "営業",
            keywords: ["営業", "セールス", "sales", "business", "ビジネス", "商談", "アポ", "インサイドセールス", "コンサルティング", "提案"]
        },
    ];

    let bestCategory = "その他";
    let maxScore = 0;

    for (const def of definitions) {
        let score = 0;
        for (const k of def.keywords) {
            if (t.includes(k)) {
                score++;
                if (def.name === "マーケティング" && (k === "マーケ" || k === "マーケティング")) {
                    score += 2;
                }
            }
        }

        if (score > maxScore) {
            maxScore = score;
            bestCategory = def.name;
        }
    }

    return maxScore > 0 ? bestCategory : "その他";
};

// 推奨コメント生成ロジック
export const getRecommendationMessage = (category: string, title: string) => {
    if (category === "エンジニア") {
        return "エンジニアとしてのキャリアは、未経験からの挑戦が最も価値を生む分野の一つです。実践的な開発経験を積むことで、将来の市場価値を大きく高めることができます。";
    }
    if (category === "デザイナー") {
        return "デザインのスキルは、座学よりも実際のプロジェクトで磨かれます。クリエイティブな現場での経験は、あなたのポートフォリオをより魅力的なものにするでしょう。";
    }
    if (category === "マーケティング") {
        return "マーケティングは、ビジネスの根幹を支える重要なスキルです。数字に基づいた分析や施策の実行経験は、どのような業界でも通用する強力な武器になります。";
    }
    if (category === "営業") {
        return "営業力は、すべてのビジネスパーソンにとって不可欠なスキルです。顧客との対話を通じて得られる折衝能力や提案力は、一生モノの財産になります。";
    }
    if (category === "企画") {
        return "アイデアを形にする企画職は、ゼロからイチを生み出す楽しさを実感できる仕事です。プロジェクトを推進する力は、将来のリーダーシップにつながります。";
    }
    if (category === "編集/ライター") {
        return "言葉で情報を伝える力は、AI時代においても決して色褪せないスキルです。読者の心を動かすコンテンツ作りを通して、発信力を磨きましょう。";
    }
    return "未経験から新しい分野に挑戦することは、大きな自己成長のチャンスです。まずは現場に飛び込み、実務を通してスキルを身につけていきましょう。";
};
