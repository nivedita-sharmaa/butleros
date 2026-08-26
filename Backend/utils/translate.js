// export async function translateText(text, targetLang = "hi") {
//     if (!text || typeof text !== "string" || text.trim() === "") {
//         return text;
//     }

//     try {
//         const response = await fetch(
//             `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
//                 text
//             )}&langpair=en|${targetLang}`
//         );

//         const data = await response.json();

//         if (data?.responseData?.translatedText) {
//             return data.responseData.translatedText;
//         }

//         console.log("Translation fallback (no result):", data);
//         return text;

//     } catch (error) {
//         console.log("Translation API error:", error.message);
//         return text;
//     }
// }

// import db from "../config/db.js";

// function getCached(text, targetLang) {
//     return new Promise((resolve) => {
//         db.query(
//             `SELECT translated_text FROM translations_cache WHERE original_text = ? AND target_lang = ? LIMIT 1`,
//             [text, targetLang],
//             (err, rows) => {
//                 if (err || rows.length === 0) return resolve(null);
//                 resolve(rows[0].translated_text);
//             }
//         );
//     });
// }

// function saveCache(text, targetLang, translated) {
//     db.query(
//         `INSERT INTO translations_cache (original_text, target_lang, translated_text)
//          VALUES (?, ?, ?)
//          ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)`,
//         [text, targetLang, translated],
//         (err) => {
//             if (err) console.log("Translation cache save error:", err);
//         }
//     );
// }

// export async function translateText(text, targetLang = "hi") {
//     if (!text || typeof text !== "string" || text.trim() === "") {
//         return text;
//     }

//     const cached = await getCached(text, targetLang);
//     if (cached) {
//         console.log("Translation cache HIT:", text.slice(0, 30));
//         return cached;
//     }

//     try {
//         const response = await fetch(
//             `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
//         );

//         const data = await response.json();

//         if (data?.responseData?.translatedText) {
//             const translated = data.responseData.translatedText;
//             saveCache(text, targetLang, translated);
//             return translated;
//         }

//         console.log("Translation fallback (no result):", data);
//         return text;

//     } catch (error) {
//         console.log("Translation API error:", error.message);
//         return text;
//     }
// }


import db from "../config/db.js";

function getCached(text, targetLang) {
    return new Promise((resolve) => {
        db.query(
            `SELECT translated_text FROM translations_cache WHERE original_text = ? AND target_lang = ? LIMIT 1`,
            [text, targetLang],
            (err, rows) => {
                if (err || rows.length === 0) return resolve(null);
                resolve(rows[0].translated_text);
            }
        );
    });
}
function saveCache(text, targetLang, translated) {
    // Defensive check — never cache anything that looks like an error,
    // even if it somehow slipped past the earlier check.
    if (
        !translated ||
        translated.toUpperCase().includes("MYMEMORY WARNING") ||
        translated.toUpperCase().includes("QUERY LENGTH LIMIT") ||
        translated.toUpperCase().includes("YOU USED ALL AVAILABLE")
    ) {
        console.log("Refusing to cache suspicious translation result:", translated?.slice(0, 60));
        return;
    }

    db.query(
        `INSERT INTO translations_cache (original_text, target_lang, translated_text)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)`,
        [text, targetLang, translated],
        (err) => {
            if (err) console.log("Translation cache save error:", err);
        }
    );
}

// Detects MyMemory's disguised error/warning responses, which come back
// as HTTP 200 with the "error" hidden inside the translated text itself
// instead of a proper error status.
function isMyMemoryError(result, responseStatus) {
    if (!result) return true;
    if (responseStatus && responseStatus !== 200) return true;

    const upper = result.toUpperCase();

    return (
        upper.includes("MYMEMORY WARNING") ||
        upper.includes("QUERY LENGTH LIMIT") ||
        upper.includes("INVALID") ||
        upper.includes("INVALID SOURCE LANGUAGE") ||
        upper.includes("INVALID TARGET LANGUAGE") ||
        upper.includes("PLEASE SELECT TWO DISTINCT LANGUAGES") ||
        upper.includes("AN ERROR OCCURED") ||
        upper.includes("YOU USED ALL AVAILABLE FREE TRANSLATIONS")
    );
}

export async function translateText(text, targetLang = "hi") {
    if (!text || typeof text !== "string" || text.trim() === "") {
        return { text, limited: false };
    }

    const cached = await getCached(text, targetLang);
    if (cached) {
        return { text: cached, limited: false };
    }

    try {
       const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=niveditasharma220044@acropolis.in`
);

        const data = await response.json();
        const result = data?.responseData?.translatedText;

        if (isMyMemoryError(result, data?.responseStatus)) {
            console.log("MyMemory limit/error hit:", result);
            return { text, limited: true }; // fall back, but flag it
        }

        saveCache(text, targetLang, result);
        return { text: result, limited: false };

    } catch (error) {
        console.log("Translation API error:", error.message);
        return { text, limited: true };
    }
}