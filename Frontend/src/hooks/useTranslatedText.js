// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// export function useTranslatedText(originalText) {
//     const { i18n } = useTranslation();
//     const [translated, setTranslated] = useState(originalText);

//     useEffect(() => {
//         if (i18n.language === "en" || !originalText) {
//             setTranslated(originalText);
//             return;
//         }

//         let cancelled = false;

//         const fetchTranslation = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await fetch(`${API_URL}/translate`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify({
//                         text: originalText,
//                         targetLang: i18n.language,
//                     }),
//                 });

//                 const data = await response.json();

//                 if (!cancelled && data.translated) {
//                     setTranslated(data.translated);
//                 }
//             } catch (error) {
//                 console.log("useTranslatedText error:", error);
//                 if (!cancelled) setTranslated(originalText);
//             }
//         };

//         fetchTranslation();

//         return () => {
//             cancelled = true;
//         };
//     }, [originalText, i18n.language]);

//     return translated;
// }

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";
const translationCache = new Map();

// Once we detect the daily limit is hit, stop hammering the API with
// more requests for the rest of the session — every subsequent call
// just falls back to English immediately, instead of firing a request
// that we already know will fail.
let translationLimitHit = false;

export function isTranslationLimited() {
    return translationLimitHit;
}

export function useTranslatedText(originalText) {
    const { i18n } = useTranslation();
    const [translated, setTranslated] = useState(originalText);

    useEffect(() => {
        if (i18n.language === "en" || !originalText) {
            setTranslated(originalText);
            return;
        }

        if (translationLimitHit) {
            setTranslated(originalText); // don't even try — we know it'll fail
            return;
        }

        const cacheKey = `${originalText}::${i18n.language}`;

        if (translationCache.has(cacheKey)) {
            setTranslated(translationCache.get(cacheKey));
            return;
        }

        let cancelled = false;

        const fetchTranslation = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/translate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text: originalText, targetLang: i18n.language }),
                });

                const data = await response.json();

                if (data.limited) {
                    translationLimitHit = true;
                    console.log("Translation limit reached — falling back to English for the rest of this session.");
                }

                if (!cancelled) {
                    setTranslated(data.translated || originalText);
                }
            } catch (error) {
                console.log("useTranslatedText error:", error);
                if (!cancelled) setTranslated(originalText);
            }
        };

        fetchTranslation();

        return () => {
            cancelled = true;
        };
    }, [originalText, i18n.language]);

    return translated;
}